import express, { Request, Response } from 'express';
import UnidadeDeSaudeService from '../services/UnidadeDeSaudeService';
import EnderecoService from '../services/EnderecoService';
import UsuarioService from '../services/UsuarioService';
import validation from '../middlewares/validation';

const UnidadeDeSaudeRouter = express.Router();

UnidadeDeSaudeRouter.post('/nova-unidade-de-saude', async (req: Request, res: Response) => {
    try {
        const camposAValidar = [
            'cep',
            'rua',
            'numero',
            'bairro',
            'cidade',
            'uf',
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
                return res.status(400).json({ Message: 'Essa Unidade de Saúde já está cadastrada!' });
            }
           await UsuarioService.adicionarUnidadeDeSaudeAoUsuario(req.body.userId,novaUnidadeDeSaude.id)
            return res.status(201).json({
                Message: 'Unidade de Saúde salva com sucesso!',
                data: novaUnidadeDeSaude,
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});

UnidadeDeSaudeRouter.put('/alterar-unidade-de-saude/:id', async (req: Request, res: Response) => {
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
            'tipo',
            'especialidades',
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
                        return res.status(400).json({ Message: 'Essa Unidade de Saúde já está cadastrada!' });

                    }

                return res.status(201).json({
                    Message: 'Unidade de Saúde alterada com sucesso!',
                    data: atualizarUnidadeDeSaude,
                });
            }
        }
    }
   else{
    res.status(404).json({Message: 'Unidade de Saúde inexistente'})
   }
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});

UnidadeDeSaudeRouter.delete('/deletar-unidade-de-saude/:id',async(req:Request,res:Response)=>{
    try {
         const {id} = req.params
        await UnidadeDeSaudeService.deletarUnidadeDeSaude(parseInt(id,10))
        res.status(204).json()
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });

    }
    })
UnidadeDeSaudeRouter.get('/unidades-de-saude', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadesDeSaude();
        res.status(200).json(unidadesDeSaude);
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
UnidadeDeSaudeRouter.get('/aprovadas', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaudeAprovadas = await UnidadeDeSaudeService.listarUnidadesDeSaudeAprovadas();
        
        res.status(200).json(unidadesDeSaudeAprovadas);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

UnidadeDeSaudeRouter.get('/unidade-de-saude/:nome', async (req: Request, res: Response) => {
    try {
        const nome = req.params.nome;
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadeDeSaudepeloNome(nome);
        res.status(200).json(unidadesDeSaude);
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
UnidadeDeSaudeRouter.get('/unidades-de-saude/pesquisa/:nome', async (req: Request, res: Response) => {
    try {
        const nome = req.params.nome;
        const unidadesDeSaude = await UnidadeDeSaudeService.pesquisa(nome);
        res.status(200).json(unidadesDeSaude);
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});

UnidadeDeSaudeRouter.get('/unidades-de-saude/filtrar/:tipo', async (req: Request, res: Response) => {
    try {
        const tipo = req.params.tipo;
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadesDeSaudePorTipo(tipo);
        res.status(200).json(unidadesDeSaude);
    } catch (error) {
        res.status(500).json({ error: 'Houve um erro interno no servidor' });
    }
});
export default UnidadeDeSaudeRouter;
