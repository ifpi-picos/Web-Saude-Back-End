import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService';

export function authMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
): void {
	const token = req.headers?.['x-access-token'];
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
