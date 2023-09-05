import { Request, Response } from 'express';

interface IuploadController {
  upload(req: Request, res: Response): Promise<Response>;
}

export default IuploadController;
