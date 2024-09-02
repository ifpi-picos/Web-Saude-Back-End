import express, { Request, Response } from 'express';
import UnidadeDeSaudeService from '../services/UnidadeDeSaudeService';
import EnderecoService from '../services/EnderecoService';
import UsuarioService from '../services/UsuarioService';
import validation from '../middlewares/validation';
import NotificacoesService from '../services/NotificacoesService';
const UnidadeDeSaudeRouter = express.Router();

UnidadeDeSaudeRouter.post('/nova-unidade-de-saude', async (req: Request, res: Response) => {
    try {
        const camposAValidar = [
            'cep',
            'rua',
            'numero',
            'cidade',
            'nome',
            'tipo',
        ];
        const erros: string[] = [];
        validation.finalizarValidacao(camposAValidar, req, erros);
        const errosFiltrados = erros.filter(erro => erro !== '');
        if (errosFiltrados.length > 0) {
            return res.status(422).json({
                Message: 'Campos inválidos',
                Errors: errosFiltrados,
            });
        }

        const novoEndereco = await EnderecoService.salvarEndereco(req.body);

        if (novoEndereco) {
            const novaUnidadeDeSaudeData = { ...req.body, endereco: novoEndereco.id,usuario:req.body.userId };
           
            const horarioAbertura = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaAbre}`);
            const horarioFechamento = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaFecha}`);

            if (horarioAbertura >= horarioFechamento) {
                return res.status(400).json({
                    Message: 'Horário de abertura deve ser menor que o horário de fechamento',
                });
            }
            
            const novaUnidadeDeSaude = await UnidadeDeSaudeService.salvarUnidadeDeSaude(novaUnidadeDeSaudeData)
            
            if (novaUnidadeDeSaude === null) {
                return res.status(409).json({ Message: 'Essa Unidade de Saúde já está cadastrada!' });
            }
           await UsuarioService.adicionarUnidadeDeSaudeAoUsuario(req.body.userId,novaUnidadeDeSaude.id)

           const usuario = await UsuarioService.obterUsuarioPorId(req.body.userId)
           NotificacoesService.criarNotificacao(
            req.body.userId,
            'Pendente',
            `${usuario?.nome} solicitou a adição de uma nova unidade de saúde: ${novaUnidadeDeSaude.nome}`
        );
        
            return res.status(201).json({
                Message: 'Unidade de Saúde salva com sucesso!',
                data: novaUnidadeDeSaude,
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});

UnidadeDeSaudeRouter.put('/alterar-unidade-de-saude/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const camposAValidar = [
            'cep',
            'rua',
            'numero',
            'cidade',
            'nome',
            'tipo',
          
        ];
        const erros: string[] = [];
        validation.finalizarValidacao(camposAValidar, req, erros);
        const errosFiltrados = erros.filter(erro => erro !== '');
        if (errosFiltrados.length > 0) {
            return res.status(422).json({
                Message: 'Campos inválidos',
                Errors: errosFiltrados,
            });
        }
        const unidadeDeSaudeID = parseInt(id, 10)
        const pegarUnidadeDeSaude = await UnidadeDeSaudeService.pegarUnidadesDeSaudePeloID(unidadeDeSaudeID)
        const enderecoID = pegarUnidadeDeSaude?.endereco.id
        
        const pegarEspecialidadesID = pegarUnidadeDeSaude?.especialidades.map((especialidade) => {
            return especialidade.id
        })

        if(pegarEspecialidadesID){

        if (pegarEspecialidadesID === undefined) {
            return res.status(400).json({ Message: 'ID das especialidades não encontrado!' });
        }
        if (enderecoID === undefined) {
            return res.status(400).json({ Message: 'ID de endereço não encontrado' });
        }
        const novoEndereco = await EnderecoService.alterarEndereco(enderecoID, req.body);

        if (novoEndereco) {
            const novaUnidadeDeSaudeData = { ...req.body};

            const horarioAbertura = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaAbre}`);
            const horarioFechamento = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaFecha}`);

            if (horarioAbertura >= horarioFechamento) {
                return res.status(400).json({
                    Message: 'Horário de abertura deve ser menor que o horário de fechamento',
                });
            }
            const removerEspecialidades = await UnidadeDeSaudeService.removerEspecialidades(unidadeDeSaudeID, pegarEspecialidadesID)
            if (removerEspecialidades) {
                const atualizarUnidadeDeSaude = await UnidadeDeSaudeService.alterarUnidadeDeSaude(unidadeDeSaudeID, novaUnidadeDeSaudeData)
                    if(atualizarUnidadeDeSaude === null){
                        return res.status(409).json({ Message: 'Essa Unidade de Saúde já está cadastrada!' });

                    }
                    const usuario = await UsuarioService.obterUsuarioPorId(req.body.userId)
                    NotificacoesService.criarNotificacao(
                        req.body.userId,
                        'Alteração',
                        `${usuario?.nome} fez uma alteração na unidade de saúde: ${atualizarUnidadeDeSaude.nome}`
                    );
                    
                return res.status(200).json({
                    Message: 'Unidade de Saúde alterada com sucesso!',
                    data: atualizarUnidadeDeSaude,
                });
            }
        }
    }
   else{
    return res.status(404).json({Message: 'Unidade de Saúde inexistente'})
   }
    } catch (error) {
       return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});

UnidadeDeSaudeRouter.delete('/deletar-unidade-de-saude/:id',async(req:Request,res:Response)=>{
    try {
         const {id} = req.params
       const unidadeDeSaude = await UnidadeDeSaudeService.deletarUnidadeDeSaude(parseInt(id,10))

       if(!unidadeDeSaude){
            return res.status(404).json({ message: 'Unidade de Saúde não encontrada.' });
        
       }
       const nomeUnidadeDeSaude = await UnidadeDeSaudeService.pegarUnidadesDeSaudePeloID(parseInt(id,10))
       const usuario = await UsuarioService.obterUsuarioPorId(req.body.userId)
       NotificacoesService.criarNotificacao(
           req.body.userId,
           'Exclusão',
           `${usuario?.nome} excluiu a unidade de saúde: ${nomeUnidadeDeSaude?.nome}`
       );
        return res.status(204).json()
    } catch (error) {
       return res.status(500).json({ message: 'Erro interno no servidor.' });

    }
    })
UnidadeDeSaudeRouter.get('/unidades-de-saude', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadesDeSaude();
        return res.status(200).json(unidadesDeSaude);
    } catch (error) {
        return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
UnidadeDeSaudeRouter.get('/unidades-de-saude/aprovadas', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaudeAprovadas = await UnidadeDeSaudeService.listarUnidadesDeSaudeAprovadas();
        
        return res.status(200).json(unidadesDeSaudeAprovadas);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
UnidadeDeSaudeRouter.get('/unidade-de-saude/:id', async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const unidadesDeSaude = await UnidadeDeSaudeService.pegarUnidadesDeSaudePeloID(parseInt(id,10));
       return res.status(200).json(unidadesDeSaude);
    } catch (error) {
       return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
UnidadeDeSaudeRouter.get('/aprovadas/:nome', async (req: Request, res: Response) => {
    try {
        const {nome} = req.params;
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadeDeSaudepeloNome(nome);
        return res.status(200).json(unidadesDeSaude);
    } catch (error) {
        return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
UnidadeDeSaudeRouter.get('/unidade-de-saude/aprovadas/:nome', async (req: Request, res: Response) => {
    try {
        const {nome} = req.params;
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadeDeSaudepeloNomeAprovadas(nome);
        return res.status(200).json(unidadesDeSaude);
    } catch (error) {
        return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
UnidadeDeSaudeRouter.get('/unidades-de-saude/pesquisa/:nome', async (req: Request, res: Response) => {
    try {
        const {nome} = req.params;
        const unidadesDeSaude = await UnidadeDeSaudeService.pesquisa(nome);
        return res.status(200).json(unidadesDeSaude);
    } catch (error) {
        return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});

UnidadeDeSaudeRouter.get('/unidades-de-saude/filtrar/:tipo', async (req: Request, res: Response) => {
    try {
        const {tipo} = req.params;
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadesDeSaudePorTipo(tipo);
        return res.status(200).json(unidadesDeSaude);
    } catch (error) {
       return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
UnidadeDeSaudeRouter.get('/unidades-de-saude/especialidade/nome/:nomeEspecialidade', async (req: Request, res: Response) => {
    try {
        const { nomeEspecialidade } = req.params;
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadesDeSaudePorEspecialidade(nomeEspecialidade);

        if (unidadesDeSaude.length === 0) {
            return res.status(404).json({ Message: 'Nenhuma unidade de saúde encontrada com essa especialidade.' });
        }

        return res.status(200).json(unidadesDeSaude);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});

export default UnidadeDeSaudeRouter;
