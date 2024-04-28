import express, { Request, Response } from 'express';
import UnidadeDeSaudeService from '../services/UnidadeDeSaudeService';
import EnderecoService from '../services/EnderecoService';
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

    const novoEndereco = await EnderecoService.salvarEndereco(req.body);

    if (novoEndereco) {
        const novaUnidadeDeSaudeData = { ...req.body, endereco: novoEndereco.id };

        const horarioAbertura = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaAbre}`);
        const horarioFechamento = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaFecha}`);

        if (horarioAbertura >= horarioFechamento) {
            return res.status(400).json({
                Message: 'Horário de abertura deve ser menor que o horário de fechamento',
            });
        }
        const novaUnidadeDeSaude = await UnidadeDeSaudeService.salvarUnidadeDeSaude(novaUnidadeDeSaudeData)
        if (novaUnidadeDeSaude === null) {
            return res.status(400).json({ Message: 'Essa Unidade de Saúde já está Cadastrada!' });
        }
        return res.status(201).json({
            Message: 'Unidade de Saúde salva com Sucesso!',
            data: novaUnidadeDeSaude,
        });
    }
 
    }

   catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Houve um Erro Interno no Servidor' });
  }
});

UnidadeDeSaudeRouter.put('/alterar-unidade-de-saude/:id', async (req: Request, res: Response) => {
    try {

      const { id } =  req.params;
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
      const unidadesDeSaudeID = parseInt(id,10)
      const pegarUnidadeDeSaude = await UnidadeDeSaudeService.pegarrUnidadesDeSaudePeloID(unidadesDeSaudeID)
      const enderecoID = pegarUnidadeDeSaude?.id
      const pegarEspecialidadesID = pegarUnidadeDeSaude?.especialidades.map((especialidades)=>{
        return especialidades.id
      })

      if (pegarEspecialidadesID === undefined) {
        return res.status(400).json({ Message: 'ID das especialidades não encontrado!' });
    }
        if (enderecoID === undefined) {
            return res.status(400).json({ Message: 'ID de endereço não encontrado' });
        }
        const novoEndereco = await EnderecoService.alterarEndereco(enderecoID,req.body);
      
      if (novoEndereco) {
          const novaUnidadeDeSaudeData = { ...req.body, endereco: novoEndereco.id };
  
          const horarioAbertura = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaAbre}`);
          const horarioFechamento = new Date(`1970-01-01T${novaUnidadeDeSaudeData.horarioSemanaFecha}`);
              
          if (horarioAbertura >= horarioFechamento) {
              return res.status(400).json({
                  Message: 'Horário de abertura deve ser menor que o horário de fechamento',
              });
          }
          const removerEspecialidades = await UnidadeDeSaudeService.removerEspecialidades(unidadesDeSaudeID,pegarEspecialidadesID)
         if(removerEspecialidades){
            const novaUnidadeDeSaude = await UnidadeDeSaudeService.alterarUnidadeDeSaude(unidadesDeSaudeID,novaUnidadeDeSaudeData)
            return res.status(201).json({
              Message: 'Unidade de Saúde Alterada com Sucesso!',
              data: novaUnidadeDeSaude,
          });
         }
         
      }
   
      }
  
     catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Houve um Erro Interno no Servidor' });
    }
  });

UnidadeDeSaudeRouter.get('/unidades-de-saude', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaude = await UnidadeDeSaudeService.listarUnidadesDeSaude();
        res.json(unidadesDeSaude);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Houve um Erro Interno no Servidor' });
    }
});

export default UnidadeDeSaudeRouter;
