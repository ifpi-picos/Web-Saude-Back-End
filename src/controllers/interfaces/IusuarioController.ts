import { Request, Response } from 'express';

interface IUsuarioController {
  salvarUsuario(req: Request, res: Response): Promise<void>;
  autenticarUsuario(req: Request, res: Response): Promise<void>;
  alterarUsuario(req: Request, res: Response): Promise<void>;
  alterarSenhaUsuario(req: Request, res: Response): Promise<void>;
  deletarUsuario(req: Request, res: Response): Promise<void>;
  deletarTodosUsuarios(req: Request, res: Response): Promise<void>;
}
export default IUsuarioController;
