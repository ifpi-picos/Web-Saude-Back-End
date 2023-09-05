interface IuploadService {
  upload(fileBuffer: Buffer): Promise<void>;
}

export default IuploadService;
