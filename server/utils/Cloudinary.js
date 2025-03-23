import { v2 as cloudinary } from 'cloudinary';
import { response } from 'express';
import fs from 'fs';
// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY // Click 'View API Keys' above to copy your API secret
});

// Upload an image
const uploadFile = async (fileUrl) => {
    try {
        if (!fileUrl) return null;
        const fileResponse = await cloudinary.uploader
            .upload(
                fileUrl, {
                resource_type: 'auto'
            }
            )
            .catch((error) => {
                console.log(error);
            })
        console.log(fileResponse.original_filename);
        console.log(fileResponse.url);
        //delete local file on upload
        fs.unlinkSync(fileUrl);


        return fileResponse;
    }
    catch (e) {
        fs.unlinkSync(fileUrl);
        return null;
    }

};

const deleteFile = async (publicId) => {
    if (!publicId) return null;
    try {
        let result = await cloudinary.uploader.destroy(publicId);
        console.log('deleted file', publicId);
        return result;
    } catch (error) {
        console.log(error);
        return null;
    }
}
// Optimize delivery by resizing and applying auto-format and auto-quality
const optimizeUrl = cloudinary.url('shoes', {
    fetch_format: 'auto',
    quality: 'auto'
});
console.log(optimizeUrl);
export { uploadFile, deleteFile }
