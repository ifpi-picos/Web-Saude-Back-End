import { Request, Response, Router } from 'express';
import HospitalService from '../services/HospitalService';
import HospitalRepository from '../repositorys/HospitalRepository';
import validation from '../middlewares/validation';
import EnderecoService from '../services/EnderecoService';
import EspecialidadesService from '../services/EspecialidadesService';
import EspecialidadesRepository from '../repositorys/EspecialidadesRepository';
import UsuarioService from '../services/UsuarioService';
import { startSession } from 'mongoose';
import Usuario from '../models/Usuario';
import NotificacoesService from '../services/NotificacoesService';

const hospitalRouter = Router();

// cadastrar hospital
hospitalRouter.post(
	'/admin/novo-hospital',
	async (req: Request, res: Response) => {
		const session = await startSession();

		try {
			await session.withTransaction(async () => {

			const camposAValidar = [
				'cep',
				'rua',
				'numero',
				'bairro',
				'cidade',
				'uf',
				'nome',
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
			}  else {
				const novoEndereco = await EnderecoService.cadastrarEndereco(req.body);

				if (novoEndereco) {
					const novoHospitalData = { ...req.body, endereco: novoEndereco._id };
					const novoHospital = await HospitalService.novoHospital(
						novoHospitalData,
					);
					if (novoHospital === null) {
						return res
							.status(400)
							.json({ Message: 'Esse Hospital já está Cadastrada!' });
					}
					
					const especialidadesIds = req.body.especialidades;
					novoHospital.usuario = req.body.userId

					await EspecialidadesService.adicionarHospitaisAEspecialidades(
						especialidadesIds,
						novoHospital._id,
					);
					await UsuarioService.adicionarHospitalAoUsuario(
						novoHospital.usuario.toString(),
						novoHospital._id,
					);

					const nomeUsuario = await Usuario.findById(req.body.userId)
					const tipo = "pedido"
					const mensagem = `${nomeUsuario?.nome} fez um pedido para adicionar um Hospital.`
	
					await NotificacoesService.novaNotificacao(tipo,mensagem)
					await session.commitTransaction();
					session.endSession();

					return res.status(201).json({
						Message: 'Hospital salvo com Sucesso!',
						data: novoHospital,
					});
				}
			}
		});

		} catch (error) {
			await session.abortTransaction();
			session.endSession()
			return res.status(500).json(error);
		}
	},
);

// alterar o hospital
hospitalRouter.put(
	'/admin/alterar-hospital/:id',
	async (req: Request, res: Response) => {

		const session = await startSession();

		try {
			await session.withTransaction(async () => {

			const { id } = req.params;
			const camposAValidar = ['nome', 'longitude', 'latitude'];

			const erros: string[] = [];
			validation.finalizarValidacao(camposAValidar, req, erros);

			const errosFiltrados = erros.filter(erro => erro !== '');

			if (errosFiltrados.length > 0) {
				return res.json({
					Message: 'Campos inválidos',
					Errors: errosFiltrados,
				});
			} else {
				const enderecoId = await EnderecoService.cadastrarEndereco(req.body);
				const hospitalAtualizadaData = { ...req.body, endereco: enderecoId };
				const hospitalAtualizado = await HospitalService.alterarHospital(
					id,
					hospitalAtualizadaData,
				);
				if (hospitalAtualizado === null) {
					return res
						.status(400)
						.json({ Message: 'Esse Hospital já está Cadastrado!' });
				}
				const especialidadesIds = req.body.especialidades;
				const idDasEspecialidades =
				await EspecialidadesRepository.listarIdsDasEspecialidadesPorHospital(
						hospitalAtualizado._id,
					);
				await EspecialidadesService.removerHospitaisDasEspecialidades(
					hospitalAtualizado._id,
					idDasEspecialidades,
				);

				await EspecialidadesService.adicionarHospitaisAEspecialidades(
					especialidadesIds,
					hospitalAtualizado._id,
				);
					
					const nomeUsuario = await Usuario.findById(req.body.userId)
					const tipo = "alteração"
					const mensagem = `${nomeUsuario?.nome} fez uma alteração no Hospital ${hospitalAtualizado.nome}.`

					await NotificacoesService.novaNotificacao(tipo,mensagem)
					await session.commitTransaction();
					session.endSession();

					await session.commitTransaction();
					session.endSession();

				return res.status(201).json({
					Message: 'Hospital Atualizado com Sucesso!',
					data: hospitalAtualizado,
				});
			}
		});

		} catch (error) {
			await session.abortTransaction();
			session.endSession()
			return res.status(500).json(error);
		}
	},
);

// deletar o hospital
hospitalRouter.delete(
	'/admin/deletar-hospital/:id',
	async (req: Request, res: Response) => {

		try {

			const { id } = req.params;
			const deletarHospital = await HospitalService.deletarHospital(id);
			if (deletarHospital) {
				EnderecoService.deletarEndereco(deletarHospital.endereco.toString());
				const idDasEspecialidades =
					await EspecialidadesRepository.listarIdsDasEspecialidadesPorHospital(
						id,
					);
				await EspecialidadesService.removerHospitaisDasEspecialidades(
					id,
					idDasEspecialidades,
				);
				await UsuarioService.removerHospitalDoUsuario(
					req.body.userId,
					id,
				);
				
				const nomeUsuario = await Usuario.findById(req.body.userId)
				const tipo = "Exclusão"
				const mensagem = `${nomeUsuario?.nome} deletou o Hospital ${deletarHospital.nome}.`
			    await NotificacoesService.novaNotificacao(tipo,mensagem)

				return res.status(204).json('');
			}

			return res.status(404).json({ Message: 'Hospital não Encontrado' });
		} catch (error) {
			return res.status(500).json(error);
		}
	},
);

// listar hospitais
hospitalRouter.get('/hospitais', async (req: Request, res: Response) => {
	try {
		const hospitais = await HospitalRepository.pegarHospitais();

		return res.status(200).json(hospitais);
	} catch (error) {
		return res.status(500).json(error);
	}
});
// filtrar hospital
hospitalRouter.get('/hospital/:nome', async (req: Request, res: Response) => {
	try {
		const { nome } = req.params;
		const hospital = await HospitalRepository.pegarHospital(nome);
		if (!hospital) {
			return res.status(404).json('Hsopital não encontrado!');
		}
		return res.status(200).json(hospital);
	} catch (error) {
		return res.status(500).json(error);
	}
});

// aprovar hospital 
hospitalRouter.put('/aprovar-hospital/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await HospitalService.aprovarHospital(id);

        return res.status(200).json({ Message: 'Hospital Aprovado com Sucesso!' });
    } catch (error) {
        return res.status(500).json(error);
    }
});

export default hospitalRouter;
