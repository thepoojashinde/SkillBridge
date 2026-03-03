
const Section = require("../models/Section");
const Course = require("../models/Course");
const Subsection = require("../models/Subsection");


exports.createSection = async(req,res)=>{
    try{

         //data fetch
         const {sectionName, courseId} = req.body;
         //validate
         if(!sectionName || !courseId){
            return res.status(404).json({
                success:false,
                message:"All the fields are required"
            })
         }
         //create section
         const newSection = await Section.create({sectionName});

         //update course with section objectID
         const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push:{
                    courseContent:newSection._id,
                }
            }, {new:true}
         ).populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      });
//TODO: use populate to replace section and
//  sub-section both in updatedCourseDetails

         //return response
         return res.status(200).json({
            success:true,
            message:"session created successfully",
            data:updatedCourseDetails

         })



    }catch(err){
        console.error(err);
          return res.status(500).json({
            success:false,
            message:"session creation failed, try again",
         })
    }
}


exports.updateSection = async (req,res)=>{
    try{
           //data input
           const {sectionName, sectionId} = req.body;

           //data validation
           if(!sectionName || !courseId){
            return res.status(404).json({
                success:false,
                message:"All the fields are required"
            })
         }

           //update data
           const section = await Section.findByIdAndUpdate(sectionId,{sectionName}, {new:true})
           
           //return res
           return res.status(200).json({
            success:true,
            message:"session updated successfully",
    
         })


    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to update section, please try again",
            error:err.message
        })
    }
}


exports.deleteSection = async (req,res) => {
    try{
          //getId - assuming that we r sending ID in params
          const {sectionId, courseId} = req.body;

          if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and Course ID are required",
      });
    }

          //use findbyid and delete
          const section = await Section.findById(sectionId);

          if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // 2️⃣ Delete all subsections inside section
    await Subsection.deleteMany({
      _id: { $in: section.subSection },
    });

    // 3️⃣ Remove section reference from Course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // 4️⃣ Delete section
    await Section.findByIdAndDelete(sectionId);


          //return response
          return res.status(200).json({
            success:true,
            message:"session deleted successfully",
    
         })
    }catch(err){
        return res.status(500).json({
            success:false,
            message:"Unable to delete section, please try again",
            error:err.message
        })
    }
}