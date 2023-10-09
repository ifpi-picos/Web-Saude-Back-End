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
	'/admin/nova-clinica',
	'/admin/nova-clinica/',
	'/admin/novo-hospital',
	'/admin/novo-hospital',
];
export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const token = req.headers?.['x-access-token'];
	const rotaAtual = req.path;

	// Verificar se a rota atual está na lista de rotas públicas ou se corresponde aos padrões '/clinica/:nome' ou '/hospital/:nome'
	if (
		rotasPublicas.includes(rotaAtual) ||
		rotaAtual.startsWith('/clinica/') ||
		rotaAtual.startsWith('/hospital/') ||
		rotaAtual.startsWith('/buscar/')
	) {
		// Esta é uma rota pública, não exigindo autenticação
		next();
	} else {
		try {
			const claims = AuthService.decodeToken(token as string);
			console.log('Decoded Token:', claims);
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
