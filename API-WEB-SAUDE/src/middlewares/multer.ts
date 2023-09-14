import multer from 'multer';
import { v2 as cloudinaryV2 } from 'cloudinary';

// Configuração do Cloudinary
cloudinaryV2.config({
  cloud_name: 'dkpivrhuy',
  api_key: '267238127544796',
  api_secret: 'dccInkIDfCFFzT8ZGyB6St6khPk',
});

// Configurar o middleware do multer para processar o upload do arquivo
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
