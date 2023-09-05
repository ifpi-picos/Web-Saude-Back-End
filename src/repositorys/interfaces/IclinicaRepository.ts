import { Request, Response } from 'express';

interface IclinicaRepository {
  listar(req: Request, res: Response): Promise<Response>;
  filtrarClinica(req: Request, res: Response): Promise<void>;
  listarClinicasPorEspecialidade(
    request: Request,
    response: Response,
  ): Promise<void>;
}

export default IclinicaRepository;
