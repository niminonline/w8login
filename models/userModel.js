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
        
    },
    isAdmin:{
        type:Number,
        default:0
    }
    
})

module.exports= mongoose.model('User', userSchema);