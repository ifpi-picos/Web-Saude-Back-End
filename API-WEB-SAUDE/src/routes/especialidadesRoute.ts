import { Request, Response, Router } from 'express';
import EspecialidadesService from '../services/EspecialidadesService';
import EspecialidadesRepository from '../repositorys/EspecialidadesRepository';
import validation from '../middlewares/validation';

const especialidadesRouter = Router();

// cadastrar especialidades
especialidadesRouter.post(
	'/nova-especialidade',
	async (req: Request, res: Response) => {
		try {
			const camposAValidar = ['nome'];

			const erros: string[] = [];
			validation.finalizarValidacao(camposAValidar, req, erros);

			const errosFiltrados = erros.filter(erro => erro !== '');

			if (errosFiltrados.length > 0) {
				return res.json({
					Message: 'Campos inválidos',
					Errors: errosFiltrados,
				});
			} else if (req.body.nome.length < 2) {
				return res.json({ Message: 'Nome muito curto!!' });
			} else {
				const novaEspecialidade = await EspecialidadesService.novaEspecailidade(
					req.body,
				);
				return res.status(201).json({
					Message: 'Especialidade salva com Sucesso!',
					data: novaEspecialidade,
				});
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);
// alterar especialidade
especialidadesRouter.put(
	'/alterar-especialidade/:id',
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const camposAValidar = ['nome'];

			const erros: string[] = [];
			validation.finalizarValidacao(camposAValidar, req, erros);

			const errosFiltrados = erros.filter(erro => erro !== '');

			if (errosFiltrados.length > 0) {
				return res.json({
					Message: 'Campos inválidos',
					Errors: errosFiltrados,
				});
			} else if (req.body.nome.length < 2) {
				return res.json({ Message: 'Nome muito curto!!' });
			} else {
				const atualizarEspecialidade =
					await EspecialidadesService.atualizarEspecailidade(id, req.body);

				if (atualizarEspecialidade === null) {
					return res
						.status(400)
						.json({ Message: 'Especialidade já cadastrada!' });
				}
				return res.status(201).json({
					Message: 'Especialidade alterada com Sucesso!',
					data: atualizarEspecialidade,
				});
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);

// deletar especialidade
especialidadesRouter.delete(
	'/deletar-especialidade/:id',
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			await EspecialidadesService.deletarEspecialidade(id);
			return res.status(204).send('');
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);
// listar especialidades
especialidadesRouter.get(
	'/especialidades',
	async (req: Request, res: Response) => {
		try {
			const especialidades =
				await EspecialidadesRepository.pegarEspecialidades();
			return res.status(201).json(especialidades);
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	},
);

export default especialidadesRouter;
