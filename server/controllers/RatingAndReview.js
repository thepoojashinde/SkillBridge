

const ratingAndReviews = require("../models/RatingandReviews");
const Course = require("../models/Course");
const RatingandReviews = require("../models/RatingandReviews");


//create rating
exports.createRating = async(req,res)=>{
    try{
       
        //get user id
        const userId = req.user.id;
        //fetch data form req ki body
        const {rating,review,courseId} = req.body;
        //check if user is enrolled or not
        const courseDetails = await Course.findOne({_id:courseId,
            studentsEnrolled:{$elemMatch: {$eq: userId}},
            
        }
        );

        if(!courseDetails){
            return res.status(404).json({
                success:false,
                message:"Student is not enrolled in the course"
            })
        }
        
        //check if user has alr reviewed
        const alreadyReviewed= await RatingandReviews.findOne(
            {user:userId, course:courseId}
        );

        if(alreadyReviewed){
             return res.status(403).json({
                success:false,
                message:"Student has already reviewed the course"
            })
        }

        //create rating/review
        const ratingReview = await RatingAndReview.create({
                                   rating, review, 
                                   course:courseId, user:userId
        })

        //update course with rating/review
        const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
            {
                $push:{
                     ratingandReviews:ratingReview._id,
                }
            },{new:true}
        )

        console.log(updatedCourseDetails);
        return res.status(200).json({
            success:true,
            message:"Rating created successfully"
        })

    }catch(err){
       return res.status(500).json({
        success:false,
        message:err.message,
       })
    }
}




//get average rating
exports.getAverageRating = async(req,res)=>{
    try{
           
        //get course Id
        const {courseId} = req.body.courseId;
        //calculate averge rating
        const result = await RatingandReviews.aggregate([
            {
            $match:{
               course: new mongoose.Types.ObjectId(courseId),
            }
        },
        {
            $group:{
                _id:null,
                avgRating: {$avg: "$rating"},

            }
        }
    ]) 
        //return rating

        if(result.length > 0){
            return res.status(200).json({
            success:true,
            avgRating:result[0].avgRating,
        })

        }

        //if no review rating exists
       
            return res.status(200).json({
            success:true,
            message:"Average rating is 0",
            
        })
         
    }catch(err){
        return res.status(500).json({
        success:false,
        message:err.message,
       })
    }
}


//get all rating
exports.getAllRatingReview = async(req,res)=>{
    try{
          const allReviews = await RatingandReviews.find({})
          .sort({rating:"descending"})
          .populate({
            path:"user",
            select:"firstName lastName email image",
          })
          .populate({
            path:"course",
            select:"courseName",
          })
          .exec();

    return res.status(200).json({
        success:true,
        message:"All reviews are fetched successfully",
        data:allReviews
       })

    }catch(e){
        return res.status(500).json({
        success:false,
        message:err.message,
       })
    }
}

