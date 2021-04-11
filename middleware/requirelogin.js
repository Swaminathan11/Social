const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../config/keys')
const mongoose = require('mongoose')
const User = mongoose.model('User')

module.exports = (req, res, next) => {
    const {authorization} = req.headers
    if(!authorization) {                                    //if user aint authorised
        return res.status(401).json({Error: 'You must be logged in'})
    }
    const token = authorization.replace("Bearer ","")        //authorization looks like: Bearer aekjjbkegk.hbgbs.geg;
                                                            //We need only token so we replace with empty string
    jwt.verify(token, JWT_SECRET, (err, payload)=> {          //verifying the authentication token 
        if(err){
            return res.status(401).json({Error: 'You must be logged in'})   
        }
        const {_id} = payload
        User.findById(_id).then((userdata)=> {
            req.user = userdata   
            next()                              //jwt's middle part is payload which conatins user identity
                                                                //info, like id so we identify user using id
        })
        
    })
}