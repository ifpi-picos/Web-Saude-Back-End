// cloudinary.ts

import { v2 as cloudinary } from 'cloudinary';

const cloudinaryConfig = {
  cloud_name: 'dkpivrhuy',
  api_key: '267238127544796',
  api_secret: 'dccInkIDfCFFzT8ZGyB6St6khPk',
};

cloudinary.config(cloudinaryConfig);
export default cloudinary;
