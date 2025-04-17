const mongoose=require("mongoose");
require("dotenv").config();
const ConnectionUrl=process.env.MongoURL;

const Connection=async()=>{
    await mongoose.connect(ConnectionUrl);
    console.log("Connection Successfully");
}
module.exports=Connection;