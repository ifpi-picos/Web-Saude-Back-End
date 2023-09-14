import { Request, Response, Router } from 'express';
import EnderecoService from '../services/EnderecoService';

const enderecoRoute = Router();

//cadastrar endereço
enderecoRoute.post('/novo-endereco', async (req: Request, res: Response) => {
  try {
    const novoEndereco = await EnderecoService.cadastrarEndereco({
      ...req.body,
    });
    console.log(req.body.cep);
    return res.status(201).json(novoEndereco);
  } catch (error) {
    return res
      .status(500)
      .json({ Message: 'Houve um erro interno ao salvar um novo endereço!!' });
  }
});

// alterar endereço
enderecoRoute.put(
  '/alterar-endereco/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const alterarEndereco = await EnderecoService.alterarEndereco(id, {
        ...req.body,
      });
      return res
        .status(201)
        .json({ Message: 'Endereço alterado com sucesso!!', alterarEndereco });
    } catch (error) {
      return res
        .status(500)
        .json({ Message: 'Houve um erro interno ao alterar o endereço!!' });
    }
  },
);

// deletar endereço
enderecoRoute.delete(
  '/deletar-endereco/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await EnderecoService.deletarEndereco(id);
      res.status(201).json({ Message: 'Endereço deletado com sucesso!!' });
    } catch (error) {
      return res
        .status(500)
        .json({ Message: 'Houve um erro interno ao deletar o endereço!!' });
    }
  },
);

enderecoRoute.delete(
  '/deletar-enerecos',
  async (req: Request, res: Response) => {
    try {
      await EnderecoService.deletarTodosEnderecos();
      res
        .status(201)
        .json({ Message: 'Todos os endereços foram deletados com sucesso!!' });
    } catch (error) {
      return res
        .status(500)
        .json({ Message: 'Houve um erro interno ao deletar os endereços!' });
    }
  },
);
export default enderecoRoute;
