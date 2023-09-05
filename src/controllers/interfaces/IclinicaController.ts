import { Request, Response, NextFunction } from 'express';

interface IClinicaController {
  cadastrar(req: Request, res: Response): Promise<Response>;
  alterarClinica(req: Request, res: Response): Promise<void>;
  deletarClinica(req: Request, res: Response): Promise<void>;
  deletarTodasClinicas(req: Request, res: Response): Promise<void>;
}

export default IClinicaController;
