const mongoose=require("mongoose");

const SignUpSchema=new mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String
    }
},{timestamps:true})
module.exports=mongoose.model("User",SignUpSchema);