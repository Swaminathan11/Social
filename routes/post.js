//script for handling posts

const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requirelogin = require('../middleware/requirelogin')
const Post = mongoose.model('Post')

//all posts displaying route
router.get('/allpost', requirelogin, (req, res) => {
    Post.find().populate('postedBy','id name')
    .populate("comments.postedBy","_id name")   //populate() displays only id and name
    .then(posts => {
        res.json({posts})
    }).catch(err => {
        console.log(err)
    })
})

//creating posts after authentication and then saving them on db
router.post('/createpost', requirelogin, (req, res) => {
    const {title, body, pic} = req.body
    if(!title||!body||!pic){
        return res.status(422).json({Error: 'Please Fill all the fields'})
    }
    const post = new Post({
        title,
        body,
        photo:pic,
        postedBy: req.user
    })
    post.save().then((result) => {
        res.json({post:result})
    }).catch(error => {
        console.log(error)
    })
})

//user pos:displaying posts of only those users, search by id
router.get('/mypost', requirelogin, (req, res) => {
    Post.find({postedBy:req.user._id}).populate('PostedBy','_id name') //populate() displays only id and name
    .then(mypost => {
        res.json({mypost})
    }).catch(err => {
        console.log(err)
    })
})

//route for likes. We are updating so we use put
router.put('/like', requirelogin, (req, res) => {

        Post.findByIdAndUpdate(req.body.postId, {
            $push:{likes:req.user._id}                       //pushing the id of those users who are logged in and liking the post 
        }, {
            new:true                //for mongodb to return new updated record
        }).exec((err, result)=>{
            if(err){
                return res.status(422).json({error:err})
            }else{
                res.json(result)
            }       
        })
})


//router for unlike
router.put('/unlike', requirelogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {
        $pull:{likes:req.user._id}                       //pulling the id of those users who are logged in and liking the post 
    }, {
        new:true                //for mongodb to return new updated record
    }).exec((err, result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }       
    })
})


router.put('/comment',requirelogin,(req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy:req.user._id
    }
    Post.findByIdAndUpdate(req.body.postId,{ //asscessing id of user commented
        $push:{comments:comment}          //pushing the id of those users who are logged in and liking the post 
    },{
        new:true                                //to see name
    })
    .populate("comments.postedBy","_id name")
    .populate("postedBy","_id name")
    .exec((err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
})


//colon to add id of post deleting
router.delete('/deletepost/:postId', requirelogin, (req, res)=> {
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err, post)=> {
        if(err ||!post ){
            return res.status(422).json({error:err})
        }
        //owner of the post === user who attempts to delete
        //its an object so we convert to string to compare
        if(post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=>{
                res.json(result)  //send result
            }).catch(err=>{
                console.log(err)
            })
        }
    })
})

router.get('/getsubpost', requirelogin, (req, res) => {
    //if posted by in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy','id name')   //populate() displays only id and name
    .populate("comments.postedBy","_id name")
    .then(posts => {
        res.json({posts})
    }).catch(err => {
        console.log(err)
    })
})

module.exports = router