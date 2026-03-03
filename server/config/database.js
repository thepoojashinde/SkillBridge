
const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = ()=>{
    mongoose.connect(process.env.MONGODB_URL)
    .then(()=>{
        console.log("DB connection successful");
    }).catch((Err)=>{
        console.log("DB connection failed");
        console.error.apply(Err);
        process.exit(1);
    })
} 



