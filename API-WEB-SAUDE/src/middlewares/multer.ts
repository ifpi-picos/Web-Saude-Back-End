import multer from 'multer';

// Configurar o middleware do multer para processar o upload do arquivo
const storage = multer.memoryStorage();
const upload = multer({ storage });

export default upload;
