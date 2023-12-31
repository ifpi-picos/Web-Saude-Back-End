import NotificacoesRepository from '../repositorys/NotificacoesRepository';
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
	'/unidade-de-saude/:nome',
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

);

consultasRouter.get('/total-unidades-de-saude', async (req: Request, res: Response) => {
    try {
        const totalUnidadesDeSaude = await ConsultasRepository.contarTotalUnidadesDeSaude();
        return res.status(200).json({ total: totalUnidadesDeSaude });
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao obter o total de unidades de saúde.' });
    }
});

consultasRouter.get('/pedidos',async (req:Request,res:Response)=>{
	try {
		const pedidos = await ConsultasRepository.pegarUnidadesDeSaudePendentes()
		res.status(200).json({Message:pedidos})
	} catch (error) {
		return res.json(error);

	}
})

consultasRouter.get('/notificacoes',async(req:Request,res:Response)=>{
	try {
		const notificacoes = await NotificacoesRepository.pegarNotificacoes();
		res.status(200).json({Message:notificacoes})

	} catch (error) {
		return res.json(error);
	}
})
export default consultasRouter;
