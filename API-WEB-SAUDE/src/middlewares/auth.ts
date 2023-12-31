import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

const rotasPrivadas = [
  '/usuarios',
  '/usuarios/',
  '/admin/nova-clinica',
  '/admin/nova-clinica/',
  '/admin/novo-hospital',
  '/admin/novo-hospital/',
  '/novo-usuario',
  '/novo-usuario/',
  '/alterar-usuario',
  '/alterar-usuario/',
  '/deletar-usuario/',
  '/deletar-usuario/',
  '/usuario/unidades-de-saude',
  '/usuario/unidades-de-saude/',
  '/usuario',
  '/usuario/',
  '/nova-especialidade',
  '/nova-especialidade/'

];

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
    const token = req.headers?.['x-access-token'];
    const rotaAtual = req.path;

  if (
    rotasPrivadas.includes(rotaAtual) ||
    rotaAtual.startsWith('/admin/alterar-hospital/') ||
    rotaAtual.startsWith('/admin/deletar-hospital/') ||
    rotaAtual.startsWith('/admin/alterar-clinica/') ||
    rotaAtual.startsWith('/admin/deletar-clinica/') ||
    rotaAtual.startsWith('/usuario/nova-senha/') ||
    rotaAtual.startsWith('/alterar-especialidade/') ||
    rotaAtual.startsWith('/deletar-especialidade/')
	
  ) {
    try {
      const claims = AuthService.decodeToken(token as string);
      req.body.userId = claims.sub;
      req.body.userType = claims.userType;

      next();
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(401).json({ code: 401, error: err.message });
      } else {
        res.status(401).json({ code: 401, error: 'Unknown auth error' });
      }
    }
  } else {
    next();
  }
}
