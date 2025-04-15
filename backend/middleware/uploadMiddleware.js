import multer from 'multer';
import cloudinary from 'cloudinary';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Configure Cloudinary
cloudinaryV2.config({
  cloud_name: 'djmd1lzrl',
  api_key: '652622144813372',
  api_secret: 'V4savK2k_e-2oZUAVyJphQu6-uY',
});

// Multer middleware to handle incoming files
const storage = multer.memoryStorage(); // Store files in memory (no need for local file storage)
const upload = multer({ storage: storage }).single('poster'); // We expect the file to be under the 'poster' field in the form-data

// Function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinaryV2.uploader.upload(file.buffer, {
      folder: 'movies', // You can specify a folder in Cloudinary to organize uploads
      public_id: `${Date.now()}`, // Generate a unique ID for the image
    });
    return result; // Return the Cloudinary response
  } catch (error) {
    throw new Error('Error uploading to Cloudinary: ' + error.message);
  }
};

export { upload, uploadToCloudinary };
