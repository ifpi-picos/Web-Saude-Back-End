import { Request, Response, NextFunction } from 'express';
import Usuario from '../models/Usuario';

class verificarUsuario {
	public verificarFuncionario = async (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		try {
			const usuarioId = req.body.userId;

			const usuario = await Usuario.findById(usuarioId);

			if (!usuario || usuario.tipo !== 'funcionario') {
				return res
					.status(403)
					.json({
						Message:
							'Acesso negado. Somente funcionários podem cadastrar clínicas.',
					});
			}

			next();
		} catch (error) {
			return res
				.status(500)
				.json({ Message: 'Erro ao verificar tipo de usuário.' });
		}
	};
}
export default new verificarUsuario();
