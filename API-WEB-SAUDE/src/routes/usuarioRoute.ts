import express, { Request, Response } from 'express';
import UsuarioService from '../services/UsuarioService';

const usuarioRouter = express.Router();

usuarioRouter.post('/novo-usuario', async (req: Request, res: Response) => {
    try {
        const { nome, email, senha, tipo } = req.body;
        const novoUsuario = await UsuarioService.salvarUsuario(nome, email, senha, tipo);

        if (!novoUsuario) {
            return res.status(400).json({ message: 'O usuário já existe.' });
        }

        res.status(201).json(novoUsuario);
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.post('/usuarios/login', async (req: Request, res: Response) => {
    try {
        const { email, senha } = req.body;
        const token = await UsuarioService.autenticarUsuario(email, senha);

        if (!token) {
            return res.status(401).json({ message: 'Credenciais inválidas.' });
        }

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro ao autenticar usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.put('/usuarios/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nome, email, senha, tipo } = req.body;
        const usuarioAtualizado = await UsuarioService.alterarUsuario(parseInt(id,10), nome, email, senha, tipo);

        if (!usuarioAtualizado) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json(usuarioAtualizado);
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.delete('/usuarios/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const usuarioDeletado = await UsuarioService.deletarUsuario(parseInt(id,10));

        if (!usuarioDeletado) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({ message: 'Usuário deletado com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
usuarioRouter.delete('/deletar-usuario',async(req:Request,res:Response)=>{
    try {
        await UsuarioService.deletarUsuario(4);
        res.status(204).json()
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Erro interno no servidor.' });

    }
    })
usuarioRouter.get('/usuarios', async (req: Request, res: Response) => {
    try {
        const usuarios = await UsuarioService.listarUsuarios();
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});

usuarioRouter.get('/usuario/unidades-de-saude', async (req: Request, res: Response) => {
    try {

        const unidadesDeSaude = await UsuarioService.listarUnidadesDeSaudeDoUsuario(req.body.userId);

        if (!unidadesDeSaude) {
            return res.status(404).json({ message: 'Usuário não encontrado ou não possui unidades de saúde associadas.' });
        }

        res.status(200).json(unidadesDeSaude);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
usuarioRouter.put('/unidades--de-saude/aprovar/:id', async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const unidadeDeSaudeAprovada = await UsuarioService.aprovarUnidadeDeSaude(parseInt(id, 10));

        if (!unidadeDeSaudeAprovada) {
            return res.status(404).json({ message: 'Unidade de saúde não encontrada.' });
        }

        res.status(200).json(unidadeDeSaudeAprovada);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
usuarioRouter.get('/pendentes', async (req: Request, res: Response) => {
    try {
        const unidadesDeSaudePendentes = await UsuarioService.listarUnidadesDeSaudePendentes();

        res.status(200).json(unidadesDeSaudePendentes);
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
});
export default usuarioRouter;
