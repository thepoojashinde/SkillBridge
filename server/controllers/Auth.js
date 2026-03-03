
const User = require("../models/user");
const otp = require("../models/OTP");
const otpGenerator = require("otp-generator");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); 
const Profile = require("../models/Profile");

require("dotenv").config();

//sendOTP
exports.sendOTP = async(req, res)=>{
   try{
         
           //fetch email from request ki body
    const {email} = req.body;

    //check if user alr exists
    const checkUserPresent = await User.findOne({email});

    if(checkUserPresent){
        return res.status(401).json({
            success:false,
            message:"user is already registered!"
        })
    }

    //generate otp
    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
        
    });
    console.log("OTP generated :",otp);

    //check if otp is unique or not
    let result = await OTP.findOne({otp:otp});

    while(result){
        otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
        
    });
    console.log("OTP generated :",otp);
    result = await OTP.findOne({otp:otp});
    }

    // payload bana lo
    const otpPayload = {email,otp};

    //create an entry in DB for OTP
     const otpBody = await OTP.create(otpPayload);
     console.log(otpBody);
     
     //return response successful
     return res.status(200).json({
        success:true,
        message:"otp sent successfully!",
        otp,
     })

   } catch(err){
      console.log(err);
      return res.status(500).json({
        success:false,
        message:err.message
      })
   }
   

}


//signup


exports.signup = async (req,res) =>{


    try{
        //data fetch from req body
    const {firstName, lastName, email,
         password, confirmPassword,accountType,
        contactNo, otp,} = req.body;

    //validate data
    if(!firstName || !lastName || !email || !password 
        || !confirmPassword || !otp){
            return res.status(401).json({
                success:false,
                message:"Fill all the required entries",
            });
        }
    
    //match both pswds
    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:"Password and confirm passwords do not match, please try again"
        })
    }

    //check if user alr exists
    const existingUser = await User.findOne({email});
    if(existingUser){
         return res.status(400).json({
            success:false,
            message:"User already registered, try logging in!"
         })
    }

    //find most recent otp for user
    const recentOtp = await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log("Recent OTP:",recentOtp);

    //validate otp
    if(recentOtp.length == 0){
        //OTP not found
        return res.status(400).json({
            success:false,
            message:"OTP not found!"
        })
    } else if(otp !== recentOtp[0].otp){
        //invalid otp
        return res.status(400).json({
            success:false,
            message:"OTP did not match"
        })
    }

    //hash pswd
    const hashedPswd = await bcrypt.hash(password,10);

    //create entry in DB

    const ProfileDetails = await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNo:null
    })


    const user = await User.create(
        {
            firstName, lastName, email, password:hashedPswd, 
            accountType, additionalDetails:ProfileDetails._id,
            image:`https://api.dicebear.com/7.x/initials/svg?seed=${firstName} ${lastName}`
        }
    )
    //return response successful
    return res.status(200).json({
        success:true,
        message:"User registered successfully"
    })

    } catch(e){
        console.error(e);
        return res.status(401).json({
            success:false,
            message:"user cannot be registered, try again!"
        })
    }
    
}

//login

exports.login = async (req , res) => {
    try{

    //fetch data
    const {email, password} = req.body;

    //validate data
    if(!email || !password){
        return res.status(401).json({
            success:false,
            message:"fill all the entries!"
        })
    }

    //check if user exists
    const user = await User.findOne({email});
    if(!user){
        return res.status(401).json({
            success:false,
            message:"User does not exist, please sign up first"
        })
    }

    //match passwords
    //generate JWT token

    if(await bcrypt.compare(password, user.password)){
         const payload = {
            email: user.email,
            id: user._id,
            accountType:user.accountType
         }
        const token = jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: "2h"
        });

        user.token = token;
        user.password = undefined;

    const options = {
        expires: new Date(Date.now() + 3*24*60*60*1000),
        httpOnly:true
    }

    //create cookie
     res.cookie("token",token, options).status(200).json({
        success:true,
        message:"Logged in successfully"
     })
    }

    else{
        return res.status(401).json({
            success:false,
            message:"Password is incorrect"
        })
    }


    } catch(Err){
        console.log(Err);
        return res.status(500).json({
            success:false,
            message:"Login failure, try again"
        })
    }

}


//changePswd
exports.changePassword = async (req,res) => {
try{
    //get data from req body
    const {oldPassword, newPassword, confirmNewPassword} = req.body;

    //validation
    if(!oldPassword || !confirmNewPassword || !newPassword){
        return res.status(400).json({
            success:false,
            message:"Fill all the entries"
        })
    }

    if(newPassword!==confirmNewPassword){
        return res.status(400).json({
            success:false,
            message:"new password and confirm new password does not match, try again!"
        })
    }

    //get user
    const userId = req.user.id; // from auth middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    //compare old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Old password is incorrect",
      });
    }

    //hash new password
    const hashedNewPswd = await bcrypt.hash(newPassword,10);

    //update pswd in DB
    user.password = hashedNewPswd;
    await user.save();
    //send mail
    await mailSender(user.email, "Password Updated", "Your password was changed successfully");

    //return response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
} catch(error){
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while changing password",
    });
}
}

