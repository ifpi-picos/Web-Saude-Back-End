import UsuarioRepository from '../repositorys/UsuarioRepository';
import UsuarioController from '../controllers/UsuarioController';
import { Router } from 'express';

const usuarioRouter = Router();
// rota para salvar usuário
usuarioRouter.post('/novo-usuario', UsuarioController.salvarUsuario);
// rota para deletar usuário
usuarioRouter.delete('/deletar-usuario/:id', UsuarioController.deletarUsuario);
// rota para deletar todos os usuários
usuarioRouter.delete(
  '/deletar-todos-usuarios',
  UsuarioController.deletarTodosUsuarios,
);
// rota para alterar usuário
usuarioRouter.patch('/alterar-usuario/:id', UsuarioController.alterarUsuario);
// rota para lista os usuários
usuarioRouter.get('/usuarios', UsuarioRepository.listarTodos);
// rota para alterar senha do usuário
usuarioRouter.patch(
  '/usuarios/:id/senha',
  UsuarioController.alterarSenhaUsuario,
);
// Rota de autenticação
usuarioRouter.post('/login', UsuarioController.autenticarUsuario);

export default usuarioRouter;
