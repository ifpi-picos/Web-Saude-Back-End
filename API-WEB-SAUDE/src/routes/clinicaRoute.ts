import { Request, Response, Router } from 'express';
import ClinicaService from '../services/ClinicaService';
import ClinicaRepository from '../repositorys/ClinicaRepository';
import validation from '../middlewares/validation';
import EnderecoService from '../services/EnderecoService';
import EspecialidadesService from '../services/EspecialidadesService';
const clinicaRouter = Router();

// cadastrar clínica
clinicaRouter.post(
	'/admin/nova-clinica',
	async (req: Request, res: Response) => {
		try {
			const camposAValidar = [
				'cep',
				'rua',
				'numero',
				'bairro',
				'cidade',
				'uf',
				'nome',
				'horarioSemana',
				'sabado',
				'longitude',
				'latitude',
				'especialidades',
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
				return res.json({ Message: 'Nome muito curto!' });
			} else {
				const novoEndereco = await EnderecoService.cadastrarEndereco(req.body);

				if (novoEndereco) {
					const novaClinicaData = { ...req.body, endereco: novoEndereco._id };
					const novaClinica = await ClinicaService.novaClinica(novaClinicaData);

					if (novaClinica === null) {
						return res
							.status(400)
							.json({ Message: 'Essa Clínica já está Cadastrada!' });
					}
					const especialidadesIds = req.body.especialidades;

					await EspecialidadesService.adicionarClinicaAEspecialidades(
						especialidadesIds,
						novaClinica._id,
					);

					return res.status(201).json({
						Message: 'Clínica salva com Sucesso!',
						data: novaClinica,
					});
				}
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
				'cep',
				'rua',
				'numero',
				'bairro',
				'cidade',
				'uf',
				'nome',
				'horarioSemana',
				'sabado',
				'longitude',
				'latitude',
				'especialidades',
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
				if (clinicaAtualizada === null) {
					return res
						.status(400)
						.json({ Message: 'Essa Clínica já está Cadastrada!' });
				}
				await EnderecoService.alterarEndereco(
					clinicaAtualizada.endereco.toString(),
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
			const deletarCliinca = await ClinicaService.deletarClinica(id);
			if (deletarCliinca) {
				EnderecoService.deletarEndereco(deletarCliinca.endereco.toString());
				return res.status(204);
			}
			return res.status(404).json({ Message: 'Clínica não Encontrada' });
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);
// deletar todas clínicas
clinicaRouter.delete(
	'/admin/clinica/deletar',
	async (req: Request, res: Response) => {
		try {
			await ClinicaService.deletarTodasClinicas();
			res.status(204);
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);

// listar clínicas
clinicaRouter.get('/clinicas', async (req: Request, res: Response) => {
	try {
		const clinicas = await ClinicaRepository.pegarClinicas();
		if (!clinicas) {
			return res.status(404).json('Nenhuma clínica foi encontrada!');
		}
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
		if (!clinica) {
			return res.status(404).json('Clínica não encontrada!');
		}
		return res.status(201).json(clinica);
	} catch (error) {
		return res.status(500).json(error);
	}
});

export default clinicaRouter;
