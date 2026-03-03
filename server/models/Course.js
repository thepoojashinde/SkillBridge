

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
      courseName:{
        type:String,
        trim:true,
      },
      courseDesc:{
        type:String,
        trim:true,
      },
      instructor: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
      },
      whatYoullLearn:{
        type:String,
      },
      courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
      ],
      ratingAndReviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"RatingandReviews",
        }
      ],
      price:{
        type:Number,
      },
      thumbnail:{
        type:String,
      },
      tags:{
            type:[String],
            required:true,

      },
      category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Tag",
      },
      studentsEnrolled:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",

      },
      instructions:{
        type:String,
      },
      status:{
        type:String,
        enum:["Draft","Published"],
      }
});

module.exports = mongoose.model("Course",courseSchema);