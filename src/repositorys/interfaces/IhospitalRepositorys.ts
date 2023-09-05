import { Request, Response } from 'express';

interface IHospitalRepository {
  listar(req: Request, res: Response): Promise<Response>;
  filtrarHospital(req: Request, res: Response): Promise<void>;
  listarHospitaisPorEspecialidade(
    request: Request,
    response: Response,
  ): Promise<void>;
}

export default IHospitalRepository;
