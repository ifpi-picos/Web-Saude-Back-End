import { Request, Response } from 'express';

interface IEnderecoController {
  cadastrar(req: Request, res: Response): Promise<Response>;
  alterarEndereco(req: Request, res: Response): Promise<void>;
  deletarEndereco(req: Request, res: Response): Promise<void>;
  deletarTodosEnderecos(req: Request, res: Response): Promise<void>;
}

export default IEnderecoController;
