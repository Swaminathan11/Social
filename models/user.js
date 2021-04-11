const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({       //user schema in database
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:"https://res.cloudinary.com/dbkmacv32/image/upload/v1618054647/Y-U-No_ut2qmh.jpg"
    },
    followers: [{
        type:ObjectId,
        ref:"User"
    }],
    following: [{
        type:ObjectId,
        ref:"User"
    }]
})

mongoose.model("User", userSchema)