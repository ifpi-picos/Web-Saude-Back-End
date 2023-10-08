import FiltroRepository from '../repositorys/FiltroRepository';
import { Request, Response, Router } from 'express';

const filtroRouter = Router();

filtroRouter.get('/buscar/', async (req: Request, res: Response) => {
	try {
		const nome = req.query.nome?.toString();
		if (!nome) {
			return res.status(400).json('O parâmetro "nome" é obrigatório na query.');
		}
		const filtro = await FiltroRepository.filtrar(nome);

		if (!filtro) {
			return res.status(404).json('Nenhum resultado foi encontado!');
		}

		return res.status(201).json(filtro);
	} catch (error) {
		return res.json(error);
	}
});
filtroRouter.get('/clinicas/especialidade/:especialidade', async (req, res) => {
	try {
		const { especialidade } = req.params; // Obtém a especialidade dos parâmetros da URL

		const clinicasEhospitais =
			await FiltroRepository.pegarClinicasPorEspecialidade(especialidade);

		if (!clinicasEhospitais || clinicasEhospitais.length === 0) {
			return res
				.status(404)
				.json({
					Message:
						'Nenhuma clínica ou hospital encontrada para a especialidade fornecida!',
				});
		}

		return res.status(200).json(clinicasEhospitais);
	} catch (error) {
		console.error(error);
		return res.status(500).json(error);
	}
});
export default filtroRouter;
