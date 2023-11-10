import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

const rotasPublicas = [
	'/',
	'/clinicas',
	'/clinicas/',
	'/hospitais',
	'/hospitais/',
	'/especialidades',
	'/especialidades/',
	'/login',
	'/login/',
	'/unidades-de-saude',
	'/unidades-de-saude/',
];
export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const token = req.headers?.['x-access-token'];
	const rotaAtual = req.path;

	if (
		rotasPublicas.includes(rotaAtual) ||
		rotaAtual.startsWith('/clinica/') ||
		rotaAtual.startsWith('/hospital/') ||
		rotaAtual.startsWith('/buscar/') ||
		rotaAtual.startsWith('/hospital-ou-clinica/') ||
		rotaAtual.startsWith('/especialidades/')
	) {
		next();
	} else {
		try {
			const claims = AuthService.decodeToken(token as string);
			req.body.userId = claims.sub;
			next();
		} catch (err: unknown) {
			if (err instanceof Error) {
				res.status(401).json({ code: 401, error: err.message });
			} else {
				res.status(401).json({ code: 401, error: 'Unknown auth error' });
			}
		}
	}
}
