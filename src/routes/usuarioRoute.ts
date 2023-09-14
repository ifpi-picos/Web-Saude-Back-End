import { Router, Request, Response } from 'express';
import UsuarioRepository from '../repositorys/UsuarioRepository';
import Usuario from '../models/Usuario';
import UsuarioService from '../services/UsuarioService';

function validaCampoVazio(campo: string, valor: object) {
  if (!valor || valor === undefined || valor === null) {
    return `${campo} vazio!!`;
  }
  return '';
}
const usuarioRouter = Router();

// rota para salvar usuário
usuarioRouter.post('/novo-usuario', async (req: Request, res: Response) => {
  try {
    const camposAValidar = ['nome', 'email', 'senha'];
    const erros: string[] = [];

    camposAValidar.forEach(campo => {
      const valor = req.body[campo];
      const erro = validaCampoVazio(campo, valor);
      if (erro) {
        erros.push(erro);
      }
    });

    const errosFiltrados = erros.filter(erro => erro !== '');

    if (errosFiltrados.length > 0) {
      return res.json({ Message: 'Campos inválidos', Errors: errosFiltrados });
    } else if (req.body.nome.length < 6) {
      return res.json({ Message: 'Nome muito curto!' });
    } else if (req.body.senha.length < 6) {
      return res.json({ Message: 'Senha muito curta!' });
    } else {
      const novoUsuario = await UsuarioService.salvarUsuario(
        req.body.nome,
        req.body.email,
        req.body.senha,
      );
      return res.json({
        Message: 'Usuário salvo com Sucesso!',
        data: novoUsuario,
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

// rota para alterar usuário
usuarioRouter.put(
  '/alterar-usuario/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const camposAValidar = ['nome', 'email', 'senha'];
      const erros: string[] = [];

      camposAValidar.forEach(campo => {
        const valor = req.body[campo];
        const erro = validaCampoVazio(campo, valor);
        if (erro) {
          erros.push(erro);
        }
      });

      const errosFiltrados = erros.filter(erro => erro !== '');

      if (errosFiltrados.length > 0) {
        return res.json({
          Message: 'Campos inválidos',
          Errors: errosFiltrados,
        });
      } else if (req.body.nome.length < 6) {
        return res.json({ Message: 'Nome muito curto!' });
      } else if (req.body.senha.length < 6) {
        return res.json({ Message: 'Senha muito curta!' });
      } else {
        const usuarioExistente = await Usuario.findOne({
          email: req.body.email,
        });

        if (usuarioExistente) {
          return res.json({ Message: 'Esse Usuário já está Cadastrado!' });
        } else {
          const novoUsuario = await UsuarioService.alterarUsuario(
            id,
            req.body.nome,
            req.body.email,
            req.body.senha,
          );
          return res.json({
            Message: 'Usuário alterado com sucesso!',
            data: novoUsuario,
          });
        }
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  },
);

// rota para deletar usuário
usuarioRouter.delete(
  '/deletar-usuario/:id',
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await UsuarioService.deletarUsuario(id);
    } catch (error) {
      return res.status(500).json(error);
    }
  },
);

// rota para deletar todos os usuários
usuarioRouter.delete(
  '/deletar-todos-usuarios',
  async (req: Request, res: Response) => {
    try {
      await UsuarioService.deletarTodosUsuarios();
    } catch (error) {
      return res.status(500).json(error);
    }
  },
);

// rota para lista os usuários
usuarioRouter.get('/usuarios', async (req: Request, res: Response) => {
  try {
    const usuarios = await UsuarioRepository.listarUsuarios();
    return res.status(201).json(usuarios);
  } catch (error) {
    return res.status(500).json(error);
  }
});

// rota para alterar senha do usuário
usuarioRouter.put('/usuario/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await UsuarioService.alterarSenhaUsuario(id, req.body.senha);
    return res.status(201).json({ mensagem: 'Senha Atualizada com Sucesso!' });
  } catch (error) {
    return res.status(500).json(error);
  }
});

// Rota de autenticação
usuarioRouter.post('/login', async (req: Request, res: Response) => {
  try {
    const camposAValidar = ['email', 'senha'];
    const erros: string[] = [];

    camposAValidar.forEach(campo => {
      const valor = req.body[campo];
      const erro = validaCampoVazio(campo, valor);
      if (erro) {
        erros.push(erro);
      }
    });

    const errosFiltrados = erros.filter(erro => erro !== '');

    if (errosFiltrados.length > 0) {
      return res.json({ Message: 'Campos inválidos', Errors: errosFiltrados });
    } else {
      const token = await UsuarioService.autenticarUsuario(
        req.body.email,
        req.body.senha,
      );

      return res.status(200).json({ token });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});

export default usuarioRouter;
