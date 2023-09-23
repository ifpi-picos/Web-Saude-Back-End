import { Request, Response, Router } from 'express';
import ClinicaService from '../services/ClinicaService';
import ClinicaRepository from '../repositorys/ClinicaRepository';
import validation from '../middlewares/validation';

const clinicaRouter = Router();

// cadastrar clínica
clinicaRouter.post(
	'/admin/nova-clinica',
	async (req: Request, res: Response) => {
		try {
			const camposAValidar = [
				'nome',
				'horarioSemana',
				'Sabado',
				'longitude',
				'latitude',
				'especialidades',
				'endereco',
			];

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
				const novaClinica = await ClinicaService.novaClinica(req.body);
				return res.status(201).json({
					Message: 'Clínica salva com Sucesso!',
					data: novaClinica,
				});
			}
		} catch (error) {
			if (error instanceof Error) return res.status(500).json(error.message);
		}
	},
);

// alterar a clínica
clinicaRouter.put(
	'/admin/alterar-clinica/:id',
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			const camposAValidar = [
				'nome',
				'horarioSemana',
				'Sabado',
				'longitude',
				'latitude',
				'especialidades',
				'endereco',
			];
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
				const clinicaAtualizada = await ClinicaService.alterarClinica(
					id,
					req.body,
				);
				return res.status(201).json({
					Message: 'Clínica Atualizada com Sucesso!',
					data: clinicaAtualizada,
				});
			}
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);

// deletar a clínica
clinicaRouter.delete(
	'/admin/deletar-clinica/:id',
	async (req: Request, res: Response) => {
		try {
			const { id } = req.params;
			await ClinicaService.deletarClinica(id);
			return res.status(201).json({ Message: 'Clínica Deletada com Sucesso!' });
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);
// deletar todas clínicas
clinicaRouter.delete('/admin/deletar', async (req: Request, res: Response) => {
	try {
		await ClinicaService.deletarTodasClinicas();
		res
			.status(201)
			.json({ Message: 'Todas as Clínicas foram Deletadas com Sucesso!' });
	} catch (error) {
		return res.status(500).json(error);
	}
});

// listar clínicas
clinicaRouter.get('/clinicas', async (req: Request, res: Response) => {
	try {
		const clinicas = await ClinicaRepository.pegarClinicas();
		return res.status(201).json(clinicas);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});
// filtrar clinica
clinicaRouter.get('/clinica/:nome', async (req: Request, res: Response) => {
	try {
		const { nome } = req.params;
		const clinica = await ClinicaRepository.pegarClinica(nome);

		return res.status(201).json(clinica);
	} catch (error) {
		return res.status(500).json(error);
	}
});

// filtrar clinicas pelas especialidade
clinicaRouter.get(
	'/clinica/especialidade/:nome',
	async (req: Request, res: Response) => {
		try {
			const { nome } = req.params;
			const clinicas = await ClinicaRepository.pegarClinicaPelaEspecialidade(
				nome,
			);

			return res.status(201).json(clinicas);
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);
export default clinicaRouter;
