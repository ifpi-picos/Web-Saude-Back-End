import { Request, Response } from 'express';

interface IespecialidadesController {
  cadastrar(req: Request, res: Response): Promise<Response>;
  deletarTodasEspecialidades(req: Request, res: Response): Promise<void>;
}

export default IespecialidadesController;
