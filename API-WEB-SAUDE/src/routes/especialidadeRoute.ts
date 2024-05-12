import express, { Request, Response } from 'express';
import EspecialidadeService from '../services/EspecialidadeService';
import validation from '../middlewares/validation';

const EspecialidadeRouter = express.Router();

EspecialidadeRouter.post('/nova-especialidade', async (req: Request, res: Response) => {

    const especialidadeData = req.body;
    try {

      const camposAValidar = ['nome'];

			const erros: string[] = [];
			validation.finalizarValidacao(camposAValidar, req, erros);

			const errosFiltrados = erros.filter(erro => erro !== '');
      if (errosFiltrados.length > 0) {
        return res.status(422).json({
          Message: 'Campos inválidos',
          Errors: errosFiltrados,
        });
        
      } else if (req.body.nome.length < 2) {
        return res.status(422).json({ Message: 'Nome muito curto!!' });
      }
      const novaEspecialidade = await EspecialidadeService.salvarEspecialidade(especialidadeData);
      if(novaEspecialidade === null){
        return res.status(409).json('Essa Especialidade já existe')
      }
      res.status(201).json(novaEspecialidade);
    } catch (error) {
        return res.status(500).json('Houve um Erro Interno no Servidor');
 
      }
    });   
    EspecialidadeRouter.put('/alterar-especialidade/:id', async (req: Request, res: Response) => {
      const { id } = req.params;
      const especialidadeData = req.body;
      try {
        const camposAValidar = ['nome'];
    
        const erros: string[] = [];
        validation.finalizarValidacao(camposAValidar, req, erros);
    
        const errosFiltrados = erros.filter(erro => erro !== '');
    
        if (errosFiltrados.length > 0) {
          return res.status(422).json({
            Message: 'Campos inválidos',
            Errors: errosFiltrados,
          });
        } else if (req.body.nome.length < 2) {
          return res.status(422).json({ Message: 'Nome muito curto!!' });
        }
    
        const especialidadeExistente = await EspecialidadeService.obterEspecialidadePorId(parseInt(id, 10));
        if (!especialidadeExistente) {
          return res.status(404).json({ message: 'Especialidade não encontrada' });
        }
    
        const especialidadeComMesmoNome = await EspecialidadeService.obterEspecialidadePorNome(especialidadeData.nome);
        if (especialidadeComMesmoNome && especialidadeComMesmoNome.id !== parseInt(id, 10)) {
          return res.status(409).json('Essa Especialidade já existe');
        }
    
        const especialidadeAtualizada = await EspecialidadeService.alterarEspecialidade(parseInt(id, 10), especialidadeData);
        
        return res.status(201).json(especialidadeAtualizada);
      } catch (error) {
        return res.status(500).json('Houve um Erro Interno no Servidor');
      }
    });
    
  EspecialidadeRouter.delete('/deletar-especialidade/:id', async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const deletada = await EspecialidadeService.deletarEspecialidade(parseInt(id, 10));
      if (!deletada) {
        res.status(404).json({ message: 'Especialidade não encontrada' });
        return;
      }
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({error});
    }
  });
  
  
  EspecialidadeRouter.get('/especialidades', async (req: Request, res: Response) => {
  try {
    const especialidades = await EspecialidadeService.obterTodasEspecialidades();
    res.json(especialidades);
  } catch (error) {
    res.status(500).json({error});
  }
});

EspecialidadeRouter.get('/especialidades/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const especialidade = await EspecialidadeService.obterEspecialidadePorId(parseInt(id, 10));
    if (!especialidade) {
      res.status(404).json({ message: 'Especialidade não encontrada' });
      return;
    }
    res.json(especialidade);
  } catch (error) {
    res.status(500).json({error});
  }
});

export default EspecialidadeRouter;
