import { Request, Response, Router } from 'express';
import ClinicaService from '../services/ClinicaService';
import ClinicaRepository from '../repositorys/ClinicaRepository';
import validation from '../middlewares/validation';
import EnderecoService from '../services/EnderecoService';
import EspecialidadesService from '../services/EspecialidadesService';
import EspecialidadesRepository from '../repositorys/EspecialidadesRepository';
import UsuarioService from '../services/UsuarioService';
import calcularStatus from '../middlewares/calcularStatus';
import { startSession } from 'mongoose';
import Usuario from '../models/Usuario';
import NotificacoesService from '../services/NotificacoesService';

const clinicaRouter = Router();

// cadastrar clínica
clinicaRouter.post('/admin/nova-clinica', async (req: Request, res: Response) => {
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
                'horarioSemana',
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
            }

            const novoEndereco = await EnderecoService.cadastrarEndereco(req.body);

            if (novoEndereco) {
                const novaClinicaData = { ...req.body, endereco: novoEndereco._id };

                const horarioAbertura = new Date(`1970-01-01T${novaClinicaData.horarioSemana.open}`);
                const horarioFechamento = new Date(`1970-01-01T${novaClinicaData.horarioSemana.close}`);

                if (horarioAbertura >= horarioFechamento) {
                    return res.status(400).json({
                        Message: 'Horário de abertura deve ser menor que o horário de fechamento',
                    });
                }

                const novaClinica = await ClinicaService.novaClinica(novaClinicaData);

                if (novaClinica === null) {
                    return res.status(400).json({ Message: 'Essa Clínica já está Cadastrada!' });
                }

                const especialidadesIds = req.body.especialidades;
                novaClinica.usuario = req.body.userId;

                await EspecialidadesService.adicionarClinicaAEspecialidades(
                    especialidadesIds,
                    novaClinica._id,
                );
                await UsuarioService.adicionarClinicaAoUsuario(
                    novaClinica.usuario.toString(),
                    novaClinica._id,
                );

                const nomeUsuario = await Usuario.findById(req.body.userId)
				const tipo = "pedido"
				const mensagem = `${nomeUsuario?.nome} fez um pedido para adicionar uma Clínica.`

			    await NotificacoesService.novaNotificacao(tipo,mensagem)

				await session.commitTransaction();
                session.endSession();
                return res.status(201).json({
                    Message: 'Clínica salva com Sucesso!',
                    data: novaClinica,
                });
            }
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        if (error instanceof Error) return res.status(500).json(error.message);
    }
});

// alterar a clínica
clinicaRouter.put(
	'/admin/alterar-clinica/:id',
	async (req: Request, res: Response) => {
		const session = await startSession();

		try {
			await session.withTransaction(async () => {

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
				'longitude',
				'latitude',
			];

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
				const clinicaAtualizadaData = { ...req.body, endereco: enderecoId };

				const horarioAberturaAtualizado = new Date(`1970-01-01T${clinicaAtualizadaData.horarioSemana.open}`);
				const horarioFechamentoAtualizado = new Date(`1970-01-01T${clinicaAtualizadaData.horarioSemana.close}`);
			
				if (horarioAberturaAtualizado >= horarioFechamentoAtualizado) {
					return res.status(400).json({
						Message: 'Horário de abertura deve ser menor que o horário de fechamento',
					});
				}
			
				const clinicaAtualizada = await ClinicaService.alterarClinica(
					id,
					clinicaAtualizadaData,
				);
				
				if (clinicaAtualizada === null) {
					return res
						.status(400)
						.json({ Message: 'Essa Clínica já está Cadastrada!' });
				}
				const especialidadesIds = req.body.especialidades;
				const idDasEspecialidades =
					await EspecialidadesRepository.listarIdsDasEspecialidadesPorClinica(
						clinicaAtualizada._id,
					);
				await EspecialidadesService.removerclinicaDasEspecialidades(
					clinicaAtualizada._id,
					idDasEspecialidades,
				);

				await EspecialidadesService.adicionarClinicaAEspecialidades(
					especialidadesIds,
					clinicaAtualizada._id,
				);

				const nomeUsuario = await Usuario.findById(req.body.userId)
				const tipo = "alteração"
				const mensagem = `${nomeUsuario?.nome} fez uma alteração na Clínica ${clinicaAtualizada.nome}.`

			    await NotificacoesService.novaNotificacao(tipo,mensagem)
				await session.commitTransaction();
				session.endSession();

				return res.status(201).json({
					Message: 'Clínica Atualizada com Sucesso!',
					data: clinicaAtualizada,
				});
			}
		});

		} catch (error) {
			await session.abortTransaction();
			session.endSession();
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
			const deletarClinica = await ClinicaService.deletarClinica(id);
			if (deletarClinica) {
				await EnderecoService.deletarEndereco(
					deletarClinica.endereco.toString(),
				);
				const idDasEspecialidades =
					await EspecialidadesRepository.listarIdsDasEspecialidadesPorClinica(
						id,
					);
				await EspecialidadesService.removerclinicaDasEspecialidades(
					id,
					idDasEspecialidades,
				);
            
				await UsuarioService.removerclinicaDoUsuario(
					req.body.userId,
					id,
				);

				const nomeUsuario = await Usuario.findById(req.body.userId)
				const tipo = "Exclusão"
				const mensagem = `${nomeUsuario?.nome} deletou a Clínica ${deletarClinica.nome}.`
			    await NotificacoesService.novaNotificacao(tipo,mensagem)
				
				return res.status(204).json('');
			}

			return res.status(404).json({ Message: 'Clínica não Encontrada' });
		} catch (error) {
			
			return res.status(500).json(error);
		}
	},
);

// listar clínicas
clinicaRouter.get('/clinicas', async (req: Request, res: Response) => {
	try {
		
		const clinicas = await ClinicaRepository.pegarClinicas();
		return res.status(200).json(clinicas);
	} catch (error) {
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
		return res.status(200).json(clinica);
	} catch (error) {
		return res.status(500).json(error);
	}
});

clinicaRouter.get('/verificar-status-clinicas', async (req: Request, res: Response) => {
	try {
	  const statuses: boolean[] = []; 

	  const clinicas = await ClinicaRepository.pegarClinicas();
	  console.log('Verificando status das clínicas...');
	
	  for (const clinica of clinicas) {
		console.log(`Processando clínica ${clinica.nome}`);
		const status = calcularStatus(clinica.horarioSemana);
		console.log("status", status);
  
		clinica.status = status;
		await clinica.save();
  
		statuses.push(status);
	  }
  
	  return res.json({ message: 'Status das clínicas verificado com sucesso.', statuses });
	} catch (error) {
	  console.error('Erro ao verificar o status das clínicas:', error);
	  return res.status(500).json({ error: 'Erro ao verificar o status das clínicas.' });
	}
  });

  // aprovar clínica
  clinicaRouter.put('/aprovar-clinica/:id',async(req:Request,res:Response)=>{
	try {
		const { id } = req.params
         await ClinicaService.aprovarClinica(id);
         
		return res.status(200).json({Message:'Clínica Aprovada com Sucesso!'})
	} catch (error) {
		return res.status(500).json(error);

	}
  })
export default clinicaRouter;
