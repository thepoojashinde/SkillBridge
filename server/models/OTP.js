

const mongoose = require("mongoose");
const mailSender = require("../utils/mailsender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires:5*60,
    },
    otp:{
        type:String,
        required:true,
    }
});

//function create krenge to send email
async function sendVerificationMail(email,otp){
   try{
      const response = await mailSender(email, "Verification Email from SkillBridge", otp);
      console.log("Email sent successfully",response);
   }catch(err){
       console.log("Error occured while sending mail:",err);
       throw err;
   }
}

otpSchema.pre("save", async function() {
    await sendVerificationMail(this.email, this.otp);
})

module.exports = mongoose.model("OTP",otpSchema);