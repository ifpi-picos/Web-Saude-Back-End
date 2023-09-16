import { Request, Response, Router } from 'express';
import EnderecoService from '../services/EnderecoService';
import EnderecoRepository from '../repositorys/EnderecoRepository';
import validation from '../middlewares/validation';
const enderecoRoute = Router();

//cadastrar endereço
enderecoRoute.post('/novo-endereco', async (req: Request, res: Response) => {
	try {
		const camposAValidar = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];

		const erros: string[] = [];

		validation.finalizarValidacao(camposAValidar,req,erros)
			const errosFiltrados = erros.filter(erro => erro !== '');

		if (errosFiltrados.length > 0) {
			return res.json({
				Message: 'Campos inválidos',
				Errors: errosFiltrados,
			});
		} else {
			const novoEndereco = await EnderecoService.cadastrarEndereco(req.body);
			console.log(req.body.cep);
			return res.status(201).json(novoEndereco);
		}
	} catch (error) {
		return res.status(500).json(error);
	}
});

// alterar endereço
enderecoRoute.put(
	'/alterar-endereco/:id',
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const camposAValidar = ['cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];

			const erros: string[] = [];
			validation.finalizarValidacao(camposAValidar,req,erros)
			
			const errosFiltrados = erros.filter(erro => erro !== '');

			if (errosFiltrados.length > 0) {
				return res.json({
					Message: 'Campos inválidos',
					Errors: errosFiltrados,
				});
			} else {
				const alterarEndereco = await EnderecoService.alterarEndereco(id, {
					...req.body,
				});
				return res
					.status(201)
					.json({
						Message: 'Endereço alterado com sucesso!!',
						alterarEndereco,
					});
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);

// deletar endereço
enderecoRoute.delete(
	'/deletar-endereco/:id',
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			await EnderecoService.deletarEndereco(id);
			res.status(201).json({ Message: 'Endereço deletado com sucesso!!' });
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);

// deletar todos os endereços
enderecoRoute.delete(
	'/deletar-enerecos',
	async (req: Request, res: Response) => {
		try {
			await EnderecoService.deletarTodosEnderecos();
			res
				.status(201)
				.json({ Message: 'Todos os endereços foram deletados com sucesso!!' });
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);

//listar os endereços
enderecoRoute.get('/enderecos', async (req: Request, res: Response) => {
	try {
		const enderecos = await EnderecoRepository.pegarEnderecos();
		return res.status(201).json(enderecos);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});
export default enderecoRoute;
