import express, { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';
import validation from '../middlewares/validation';
const usuarioRouter = express.Router();

usuarioRouter.post('/novo-usuario', async (req: Request, res: Response) => {
    try {

        const camposAValidar = [
            'nome',
            'email',
            'senha'
            
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

        const { nome, email, senha, tipo } = req.body;
        const novoUsuario = await UsuarioService.salvarUsuario(nome, email, senha, tipo);

        if (!novoUsuario) {
            return res.status(409).json({ message: 'O usuário já existe.' });
        }

       return res.status(201).json(novoUsuario);
    } catch (error) {
       return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.post('/usuarios/login', async (req: Request, res: Response) => {
    try {
        const camposAValidar = [
            'email',
            'senha'
            
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
        const { email, senha } = req.body;
        const dados = await UsuarioService.autenticarUsuario(email, senha);

        if (!dados) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }
         await UsuarioService.alterarStatusUsuario(parseInt(dados.Id,10),true)
       return  res.status(200).json({ dados });
    } catch (error) {
         return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.put('/alterar-usuario', async (req: Request, res: Response) => {
    try {

        const camposAValidar = [
            'nome',
            'email',
            'senha'
            
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
        const { nome, email, senha, tipo } = req.body;
        const usuarioAtualizado = await UsuarioService.alterarUsuario(req.body.userId, nome, email, senha, tipo);

        if (usuarioAtualizado === null) {
            return res.status(409).json({ message: 'Usuário já existe.' });
        }

        return res.status(200).json(usuarioAtualizado);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
usuarioRouter.put('/alterar-senha', async (req: Request, res: Response) => {
    try {
        const camposAValidar = [
            'senha',
            'confirmarSenha'
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

        const { senha, confirmarSenha } = req.body;
        const userId = req.body.userId; 

        if (senha !== confirmarSenha) {
            return res.status(422).json({ message: 'A senha e o confirmar senha não são iguais.' });
        }

        const usuarioAtualizado = await UsuarioService.alterarSenhaUsuario(userId, senha);

        if (!usuarioAtualizado) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

       return res.status(200).json({ message: 'Senha alterada com sucesso.' });
    } catch (error) {
       return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.delete('/deletar-usuario', async (req: Request, res: Response) => {
    try {
        const usuarioDeletado = await UsuarioService.deletarUsuario(req.body.userId);

        if (!usuarioDeletado) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
      return  res.status(204).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
       return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.delete('/deletar-usuario/:id', async (req: Request, res: Response) => {
    const {id} = req.params
    try {
        const usuarioDeletado = await UsuarioService.deletarUsuario(parseInt(id,10));

        if (!usuarioDeletado) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
       return res.status(204).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
       return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.get('/usuarios', async (req: Request, res: Response) => {
    try {
        const usuarios = await UsuarioService.listarUsuarios();
        return res.status(200).json(usuarios);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.get('/usuario/unidades-de-saude', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaude = await UsuarioService.listarUnidadesDeSaudeDoUsuario(req.body.userId);

        if (!unidadesDeSaude) {
            return res.status(404).json({ message: 'Usuário não encontrado ou não possui unidades de saúde associadas.' });
        }

        return res.status(200).json(unidadesDeSaude);
    } catch (error) {
       return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.put('/unidades-de-saude/aprovar/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const unidadeDeSaudeAprovada = await UsuarioService.aprovarUnidadeDeSaude(parseInt(id, 10));

        if (!unidadeDeSaudeAprovada) {
            return res.status(404).json({ message: 'Unidade de saúde não encontrada.' });
        }

         return res.status(200).json(unidadeDeSaudeAprovada);
    } catch (error) {
         return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.get('/unidades-de-saude/pendentes', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaudePendentes = await UsuarioService.listarUnidadesDeSaudePendentes();
       return res.status(200).json(unidadesDeSaudePendentes);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.get('/usuarios/pesquisar/:busca', async (req: Request, res: Response) => {
    try {
        const { busca } = req.params;

        if (!busca || typeof busca !== 'string') {
            return res.status(400).json({ message: 'Parâmetro de busca inválido.' });
        }

        const usuariosEncontrados = await UsuarioService.pesquisarUsuarios(busca);

        return res.status(200).json(usuariosEncontrados);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.get('/total', async (req: Request, res: Response) => {
    try {
        const total = await UsuarioService.contarTotalUsuariosEUnidadesDeSaude();
        return res.status(200).json(total);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
usuarioRouter.put('/usuarios/desativar', async (req: Request, res: Response) => {
    try {
        const usuario = await UsuarioService.alterarStatusUsuario(req.body.userId, false);

        if (!usuario) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

       return res.status(200).json(usuario);
    } catch (error) {
       return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.get('/usuarios/ativos', async (req: Request, res: Response) => {
    try {
        const usuariosAtivos = await UsuarioService.listarUsuariosAtivos();
       return res.status(200).json(usuariosAtivos);
    } catch (error) {
        return res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

export default usuarioRouter;
