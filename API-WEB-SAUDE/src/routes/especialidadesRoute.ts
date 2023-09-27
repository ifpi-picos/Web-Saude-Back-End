import { Request, Response, Router } from 'express';
import EspecialidadesService from '../services/EspecialidadesService';
import EspecialidadesRepository from '../repositorys/EspecialidadesRepository';
import { authMiddleware } from '../middlewares/auth';
import validation from '../middlewares/validation';

const especialidadesRouter = Router();

// cadastrar especialidades
especialidadesRouter.post(
	'/nova-especialidade',authMiddleware,
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

// filtrar Especialidade
especialidadesRouter.get(
	'/especialidade/:nome',
	async (req: Request, res: Response) => {
		try {
			const { nome } = req.params;
			const especialidade = await EspecialidadesRepository.pegarEspecialidade(
				nome,
			);
			if (especialidade) {
				return res.json(especialidade);
			} else {
				return res
					.status(404)
					.json({ message: 'Especialidade não Encontrada!' });
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);
export default especialidadesRouter;
