/*import SuporteService from '../services/SuporteService';
import SuporteRepository from '../repositorys/SuporteRepository';
import { Request, Response, Router } from 'express';
import validation from '../middlewares/validation';

const suporteRoute = Router();

suporteRoute.post('/enviarMensagem', async (req: Request, res: Response) => {
	try {
		const camposAValidar = ['nome', 'email', 'mensagem'];
		const erros: string[] = [];

		validation.finalizarValidacao(camposAValidar, req, erros);
		const errosFiltrados = erros.filter(erro => erro !== '');

		if (errosFiltrados.length > 0) {
			return res.json({
				Message: 'Campos inválidos',
				Errors: errosFiltrados,
			});
		} else if (req.body.nome.length < 2) {
			return res.json({ Message: 'Nome muito curto!' });
		} else {
			const enviarMensagem = await SuporteService.enviarMsg(req.body);
			return res
				.status(201)
				.json({ Message: 'Mensagem Enviada com Sucesso!', enviarMensagem });
		}
	} catch (error) {
		return res.status(500).json(error);
	}
});

suporteRoute.get('/mensagensRecebidas', async (req: Request, res: Response) => {
	try {
		const mensagensRecebidas = await SuporteRepository.mensagensRecebidoas();
		return res.status(201).json({ Message: mensagensRecebidas });
	} catch (error) {
		return res.status(500).json(error);
	}
});

export default suporteRoute;
*/