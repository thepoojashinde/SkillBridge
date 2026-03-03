
const User = require("../models/user");
const mailsender = require("../utils/mailsender");
const bcrypt = require("bcrypt")

//reset password token- generates a link and mail it.
exports.resetPasswordToken = async (req,res)=>{

    try{
        //get email from req ki body
    const {email} = req.body;
    //validate the email
    const user = await User.findOne({email:email});
    if(!user){
        return res.status(201).json({
            success:false,
            message:"Your email is not registered with us."
        })
    }
    //generate tokens
    const token = crypto.randomUUID();
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
        {email:email},
         {
            token:token,
            resetPswdExpires:Date.now() + 5*60*1000
         },
        {new:true});

    //create url
    const url = `http://localhost:3000/update-password/${token}`

    //send mail containing the url
    await mailsender(email,"Password reset link",`Password reset url: ${url}`);
    //send response
    return res.status(200).json({
        success:true,
        message:"Email sent successfully. Please check email and change password."
    })

    

    } catch(e){
        return res.status(400).json({
            success:false,
            message:"something went wrong while sending reset link on mail",
        })
    }
    
}



//reset password- update password within db.
exports.resetPassword = async(req,res) =>{
   try{
     //fetch data
    const {password, confirmPassword, token} = req.body;
    //validation
    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm passwords do not match, try again!"   
        })
    }

    //get user details
    const userDetails = await User.findOne({token:token});

    //if no entry - 1.invalid token
    if(!userDetails){
        return res.status(401).json({
            success:false,
            message:"Token is invalid"
        })
    }

    //              2.token time expires
    if(userDetails.resetPswdExpires < Date.now()){
        return res.status(401).json({
            success:false,
            message:"Token has expired, please regenerate your token.",
        })
    }
    
    //pswd ko hash krna hai
    const hashedPassword = await bcrypt.hash(password,10);

    //update pswd
    await User.findOneAndUpdate(
  { token },
  {
    password: hashedPassword,
    token: undefined,
    resetPswdExpires: undefined,
  },
  { new: true }
)
    //send response
    return res.status(200).json({
        success:true,
        message:"Password reset successful",
    });

    
    
   }catch(err){
    console.log("RESET ERROR:", err);
    return res.status(400).json({
        
        success:false,
        message:"Password reset failure, please try again"
    })
   }
}
