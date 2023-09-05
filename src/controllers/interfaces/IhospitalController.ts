import { Request, Response } from 'express';

interface IHospitalController {
  cadastrar(req: Request, res: Response): Promise<Response>;
  alterarHospital(req: Request, res: Response): Promise<void>;
  deletarHospital(req: Request, res: Response): Promise<void>;
  deletarTodasOsHospitais(req: Request, res: Response): Promise<void>;
}

export default IHospitalController;
