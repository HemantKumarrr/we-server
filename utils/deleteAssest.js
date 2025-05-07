import cloudinary from "../config/cloudinaryUploads.js";

const deleteAsset = async (publicId, resourceType = "image") => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    console.log(`Deleted asset: `, result);
    return result;
  } catch (error) {
    console.error("Error deleting asset from Cloudinary:", error);
    throw error;
  }
};

export default deleteAsset;
