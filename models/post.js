const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    body: {
        type:String,
        required: true
    },
    photo: {
        type:String,
        required: true
        
    },
    likes: [{type:ObjectId, ref:"User"}],  
     //storing the id of thse who liked the post referencing USer model
     comments: [{
        text:String,
        postedBy:{type:ObjectId, ref:"User"}
    }],
     postedBy: {
        type: ObjectId,                    //id of the user who posted
        ref:"User"                        //referencing User Schema
    }
})

mongoose.model('Post', postSchema)