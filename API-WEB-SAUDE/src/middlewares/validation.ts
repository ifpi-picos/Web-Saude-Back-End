import { Request } from 'express';

class Validation {
	private removeEspacosInicioFim(valor: string) {
		// Utilizar expressão regular para remover espaços do início e do final
		return valor.replace(/^\s+|\s+$/g, '');
	}

	public validaCampoVazio(campo: string, valor: string | object) {
		if (typeof valor === 'string') {
			// Remover espaços do início e do final se for uma string
			valor = this.removeEspacosInicioFim(valor);

			// Agora, valor é uma string sem espaços no início e no final
		}

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

			if (typeof valor === 'string') {
				req.body[campo] = this.removeEspacosInicioFim(valor);
			}

			const erro = this.validaCampoVazio(campo, valor);
			if (erro) {
				erros.push(erro);
			}
		});
	}
}

export default new Validation();
