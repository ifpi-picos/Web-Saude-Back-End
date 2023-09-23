import { Request } from 'express';

class Validation {
	public validaCampoVazio(campo: string, valor: object) {
		if (!valor || valor === undefined || valor === null) {
			return `${campo} vazio!!`;
		}
		return '';
	}

	public finalizarValidacao(
		camposAvalidar: string[],
		req: Request,
		erros: string[],
	) {
		camposAvalidar.forEach(campo => {
			const valor = req.body[campo];
			const erro = this.validaCampoVazio(campo, valor);
			if (erro) {
				erros.push(erro);
			}
		});
	}
}
export default new Validation();
