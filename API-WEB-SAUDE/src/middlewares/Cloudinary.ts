// cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConfig = {
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
};

cloudinary.config(cloudinaryConfig);
export default cloudinary;
