import FiltroRepository from '../repositorys/FiltroRepository';
import { Request, Response, Router } from 'express';

const filtroRouter = Router();

filtroRouter.get('/buscar/:nome', async (req: Request, res: Response) => {
	try {
		const { nome } = req.params;

		const filtro = await FiltroRepository.filtrar(nome);

		if (!filtro) {
			return res.status(404).json('Nenhum resultado foi encontado!');
		}
		return res.status(201).json(filtro);
	} catch (error: any) {
		return res.json(error.message);
	}
});

export default filtroRouter;
