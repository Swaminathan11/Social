const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require("../config/keys")
const requirelogin = require('../middleware/requirelogin')

const User = mongoose.model("User")


router.get('/', (req, res) => {
    res.send("hello")
})

router.post('/signup', (req, res) => {
    const {name,email,password,pic} = req.body
    if(!email||!name||!password) {
        res.status(422).send({Error : "Please Fill in all the details"})
    }
    User.findOne({email:email}).then((savedUser) => {
        if(savedUser) {
            res.status(422).send({Error : "User Already Exists"})
        }
       bcrypt.hash(password, 8).then((hashedpassword) => {                      //brcyrpt for hashing passwords
        const user = new User({
            email,
            password:hashedpassword,                                        //save hashed passwords in db
            name,
            pic
        })
        user.save().then((user) => {
            res.json({messgae: "Saved User Successfully"})  
        }).catch((error)=>{
            console.log(error)
        }) 
       })
        
    }).catch((e)=> {
        console.log(e)
    })
})

router.post('/signin', (req, res) => {
    const{email,password} = req.body
    if(!email||!password){
        res.status(422).json({error: "Please enter username and password"})
    }
    User.findOne({email:email})
    .then((saveduser)=>{
        if(!saveduser){
            res.status(422).json({error: "Invalid Credentials"})
        }
        bcrypt.compare(password, saveduser.password)        //compare hashed and original password entered
        .then(doMatch => {
            if(doMatch){
                //res.json({Message: "Signed In successfully"})
                
                const token = jwt.sign({_id:saveduser._id}, JWT_SECRET)  

                //if all creds success, then send jwt token
                //sign used id becaz its unique along with the 
                //secret key. hasing(secretkey + header+payload) = digital signature(third part in token)
                
                //saving the id,name and email of the user
                const {_id,name,email,followers,following,pic} = saveduser 
                //sending the authorization token along with user creds
                res.json({token, user: {_id,name,email,followers,following,pic}})
            }else{
                res.status(422).json({error: "Invalid Username or password"})
            }
        })
    }).catch((error)=> {
        console.log(error)
    })
})

module.exports = router