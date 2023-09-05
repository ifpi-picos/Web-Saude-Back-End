import { Request, Response } from 'express';

interface IespecialidadesRepositories {
  listarEspecialidades(req: Request, res: Response): Promise<void>;
}

export default IespecialidadesRepositories;
