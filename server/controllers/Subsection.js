
const Subsection = require("../models/Subsection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//create Subsection

exports.createSubSection = async (req,res) =>{
    try{
        
        //fetch details
        const {sectionId, title, timeDuration, description} = req.body;
        //extract file/video
        const video = req.files.videoFile
        //validation
        if(!sectionId ||  !title || !timeDuration || !description || !video){
            return res.status(404).json({
                success:false,
                message:"All fields are required",
            })
        }
        console.log("FILE OBJECT:", video);
        console.log("TEMP PATH:", video.tempFilePath);
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(
  video,
  process.env.FOLDER_NAME,
  "video"   
);
        //create subsection in DB
        const SubsectionDetails = await Subsection.create({
            title:title,
            timeDuration:timeDuration, 
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update section with this section
        const updatedSection = await Section.findByIdAndUpdate(sectionId,
            {
                $push:{
                    subSection:SubsectionDetails._id
                }
            }, {new:true}
        ).populate("subSection")
        //HW: LOG UPDATED SECTION HERE, AFTER ADDING POPULATE QUERY
        //return status
        return res.status(200).json({
            success:true,
            message:"Subsection created successfully",
            updatedSection
    
         })


    }catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"Subsection creation failed, please try again",
    
         })
    }
}



//HW: update and delete Subsection

exports.updateSubSection = async(req,res)=>{
    try{
        //fetch details
         const {subsectionID, title,timeDuration, description} = req.body;

         //validate details
         if (!subsectionId) {
      return res.status(400).json({
        success: false,
        message: "Subsection ID is required",
      });
    }

    // find existing subsection
    const subSection = await Subsection.findById(subsectionID);

    if(!subSection){
        return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    //if new video uploaded
    if (req.files && req.files.videoFile) {
      const video = req.files.videoFile;

      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      subSection.videoUrl = uploadDetails.secure_url;
    }

    // Update other fields (if provided)
    if (title) subsection.title = title;
    if (timeDuration) subsection.timeDuration = timeDuration;
    if (description) subsection.description = description;

    await subSection.save();

    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      data: subSection,
    });

     }catch(err){
      return res.status(500).json({
      success: false,
      message: "Subsection update failed",
      error: err.message,
    });
    }
}


//delete subsection

exports.deleteSubSection = async (req, res)=>{
    try{
        //fetch id
        const { subsectionId, sectionId } = req.body;

        //validate
        if (!subsectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Subsection ID and Section ID are required",
      });
    }
        // 3️⃣ Delete Subsection document
    const deletedSubsection = await Subsection.findByIdAndDelete(subsectionId);

    if (!deletedSubsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    // 4️⃣ Remove reference from Section
    await Section.findByIdAndUpdate(
      sectionId,
      {
        $pull: { subSection: subsectionId },
      },
      { new: true }
    );

         return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
      
    }); 

    }catch(err){
         return res.status(500).json({
      success: false,
      message: "Subsection deletion failed",
      error: err.message,
    });
    }
}