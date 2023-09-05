import { Request, Response } from 'express';
interface IsuporteController {
  enviarMenssagen(req: Request, res: Response): Promise<void>;
}

export default IsuporteController;
