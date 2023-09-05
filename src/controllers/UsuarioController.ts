import { Request, Response } from 'express';
import { validationResult, body } from 'express-validator';
import UsuarioService from '../services/Usuario.service';
import IUsuarioController from './interfaces/IusuarioController';

class UsuarioController implements IUsuarioController {
  public async salvarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { nome, email, senha } = req.body;

      const newUser = await UsuarioService.salvarUsuario(nome, email, senha);

      res
        .status(201)
        .json({ message: 'Usuário criado com sucesso', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao salvar o usuário' });
    }
  }

  public async autenticarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { email, senha } = req.body;

      const token = await UsuarioService.autenticarUsuario(email, senha);

      res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      res.status(401).json({ error: 'Erro ao autenticar o usuário' });
    }
  }

  public async alterarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { nome, email, senha } = req.body;

      const updatedUser = await UsuarioService.alterarUsuario(
        id,
        nome,
        email,
        senha,
      );

      res
        .status(200)
        .json({ message: 'Usuário alterado com sucesso', user: updatedUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao alterar o usuário' });
    }
  }

  public async alterarSenhaUsuario(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;
      const { senha } = req.body;

      await UsuarioService.alterarSenhaUsuario(id, senha);

      res.status(200).json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao alterar a senha do usuário' });
    }
  }

  public async deletarUsuario(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { id } = req.params;

      await UsuarioService.deletarUsuario(id);

      res.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar o usuário' });
    }
  }

  public async deletarTodosUsuarios(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      await UsuarioService.deletarTodosUsuarios();

      res.status(200).json({ message: 'Todos os usuários foram deletados' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erro ao deletar todos os usuários' });
    }
  }
}

export default new UsuarioController();
