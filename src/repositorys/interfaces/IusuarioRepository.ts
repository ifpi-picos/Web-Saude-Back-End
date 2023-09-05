import { Response, Request } from 'express';

export default interface IRepository {
  listarTodos(req: Request, res: Response): Promise<void>;
  obterPorId(req: Request, res: Response): Promise<void>;
}
