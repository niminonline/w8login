const { MongoTopologyClosedError } = require("mongodb");
const mongoose= require("mongoose");
const userSchema= mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Number,
        required:true
    }
    
})

module.exports= mongoose.model('User', userSchema);