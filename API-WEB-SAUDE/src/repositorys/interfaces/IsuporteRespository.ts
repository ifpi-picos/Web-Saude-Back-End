import { Request, Response } from 'express';

interface IsuporteRepository {
  emailsRecebidos(req: Request, res: Response): Promise<void>;
}

export default IsuporteRepository;
