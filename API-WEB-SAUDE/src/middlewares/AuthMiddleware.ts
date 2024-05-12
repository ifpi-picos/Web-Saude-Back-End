import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

const rotasPrivadas = [
  '/usuarios',
  '/usuarios/',
  '/nova-unidade-de-saude',
  '/nova-unidade-de-saude/',
  '/alterar-usuario',
  '/alterar-usuario/',
  '/deletar-usuario',
  '/deletar-usuario/',
  '/unidades-de-saude',
  '/unidades-de-saude/',
  '/usuario/unidades-de-saude',
  '/usuario/unidades-de-saude/',
  '/usuario',
  '/usuario/',
  '/alterar-senha',
  '/alterar-senha/',
  '/usuarios/desativar',
  '/usuarios/desativar/',
  '/usuarios/ativos',
  '/usuarios/ativos/',
  '/total',
  '/total/',

];

export default function AuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
    const token = req.headers?.['x-access-token'];
    const rotaAtual = req.path;

  if (
    rotasPrivadas.includes(rotaAtual) ||
    rotaAtual.startsWith('/alterar-unidade-de-saude/') ||  
    rotaAtual.startsWith('/deletar-unidade-de-saude/') ||
    rotaAtual.startsWith('/usuario/nova-senha/') ||
    rotaAtual.startsWith('/deletar-especialidade/') ||
    rotaAtual.startsWith('/unidades-de-saude/aprovar/') ||
    rotaAtual.startsWith('/unidade-de-saude/')
	
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
