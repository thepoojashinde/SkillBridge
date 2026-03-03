const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");


//auth
exports.auth = async(req, res, next)=>{
    try{
      //extract token
      const token = req.cookies.token 
                    || req.body.token 
                    || req.header("Authorization")?.replace("Bearer ", "");

                    //if token is missing then return response
                    if(!token){
                        return res.status(401).json({
                            success: false,
                            message:"Token is missing" 
                        });

                    }

                    //verify the token
                    try{
                        const payload = jwt.verify(token, process.env.JWT_SECRET);
                        console.log("decoded payload:",payload);
                        req.user = payload;
                    }catch(err){
                         //verification issue
                         return res.status(401).json({
                            success:false,
                            message:"token invalid",
                         });
                    }

                    next();
    }catch(err){
           return res.status(200).json({
            success:false,
            message:"something went wrong while validating the token. "
           })
    }
}

//isStudent
exports.isStudent = async (req,res,next) =>{
    try{
      
     if(req.user.accountType!== "Student"){
        return res.status(400).json({
            success:false,
            message:"this is a protected route for students only."
        });
        
     }
 next();

    }catch(err){
          return res.status(200).json({
            success:false,
            message:"user role cannot be verified, try again!"
           })
    }
}

//isInstructor
exports.isInstructor = async (req,res,next) =>{
    try{
      
     if(req.user.accountType!== "Instructor"){
        return res.status(400).json({
            success:false,
            message:"this is a protected route for instructors only."
        });
        
     }
 next();

    }catch(err){
          return res.status(200).json({
            success:false,
            message:"user role cannot be verified, try again!"
           })
    }
}


//isAdmin
exports.isAdmin = async (req,res,next) =>{
    try{
      
     if(req.user.accountType!== "Admin"){
        return res.status(400).json({
            success:false,
            message:"this is a protected route for admins only."
        });
        
     }
 next();

    }catch(err){
          return res.status(200).json({
            success:false,
            message:"user role cannot be verified, try again!"
           })
    }
}
