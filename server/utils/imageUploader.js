
const cloudinary = require("cloudinary").v2;

exports.uploadImageToCloudinary = async (file, folder, resourceType = "auto") => {
  const options = {
    folder,
    resource_type: resourceType,  
  };

  return await cloudinary.uploader.upload(file.tempFilePath, options);
};