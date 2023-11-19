import ConsultasRepository from '../repositorys/ConsultasRepository';
import { Request, Response, Router } from 'express';

const consultasRouter = Router();

consultasRouter.get('/buscar/', async (req: Request, res: Response) => {
	try {
		const nome = req.query.nome?.toString();
		if (!nome) {
			return res.status(400).json('O parâmetro "nome" é obrigatório na query.');
		}
		const filtro = await ConsultasRepository.buscar(nome);

		return res.status(200).json(filtro);
	} catch (error) {
		return res.json(error);
	}
}); 
consultasRouter.get('/especialidade/', async (req: Request, res: Response) => {
	try {
		const nome = req.query.nome?.toString();
		if (!nome) {
			return res.status(400).json('O parâmetro "nome" é obrigatório na query.');
		}
		const filtro = await ConsultasRepository.filtrarUnidadesDeSaudePelaEspecialidade(nome);

		return res.status(200).json(filtro);
	} catch (error) {
		return res.json(error);
	}
}); 
consultasRouter.get(
	'/unidades-de-saude',
	async (req: Request, res: Response) => {
		try {
			const unidadesDeSaude =
				await ConsultasRepository.pegarHospitaiseClinicas();

			return res.status(200).json({ Message: unidadesDeSaude });
		} catch (error) {
			return res.json(error);
		}
	},
);

consultasRouter.get(
	'/hospital-ou-clinica/:nome',
	async (req: Request, res: Response) => {
		try {
			const { nome } = req.params;
			const unidadesDeSuade = await ConsultasRepository.pegarHospitalouClinica(
				nome,
			);

			return res.status(200).json(unidadesDeSuade);
		} catch (error) {
			return res.json(error);
		}
	},
);

consultasRouter.get(
	'/especialidades/:nome',
	async (req: Request, res: Response) => {
		try {
			const { nome } = req.params;
			const especialidades =
				await ConsultasRepository.pegarEspecialidadesDaUnidadeDeSaude(nome);
			return res.status(200).json(especialidades);
		} catch (error) {
			return res.json(error);
		}
	},

	consultasRouter.get(
		'/unidades-de-saude-paginadas',
		async (req: Request, res: Response) => {
			try {
				const { pagina } = req.query;
				const paginaAtual = pagina ? parseInt(pagina as string, 10) : 1;

				const resultadoPaginado =
					await ConsultasRepository.pegarHospitaiseClinicasPorPagina(
						paginaAtual,
					);

				return res.status(200).json(resultadoPaginado);
			} catch (error) {
				return res
					.status(500)
					.json({ error: 'Erro ao buscar unidades de saúde paginadas' });
			}
		},
	),
);

export default consultasRouter;
