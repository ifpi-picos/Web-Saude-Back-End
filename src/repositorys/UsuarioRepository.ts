import { Response, Request } from 'express';
import Usuario from '../models/Usuario';
import IRepository from './interfaces/IusuarioRepository';

class UsuarioRepository implements IRepository {
  async listarTodos(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await Usuario.find();
      res.status(200).json(usuarios);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao listar os usuários' });
    }
  }

  async obterPorId(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = await Usuario.findById(id);
      if (!usuario) {
        res.status(404).json({ message: 'Usuário não encontrado' });
        return;
      }
      res.status(200).json(usuario);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao obter o usuário' });
    }
  }
}

export default new UsuarioRepository();
