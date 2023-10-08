import { Router, Request, Response } from 'express';
import UsuarioRepository from '../repositorys/UsuarioRepository';
import UsuarioService from '../services/UsuarioService';
import validation from '../middlewares/validation';

const usuarioRouter = Router();

// rota para salvar usuário
usuarioRouter.post('/novo-usuario', async (req: Request, res: Response) => {
	try {
		const camposAValidar = ['nome', 'email', 'senha'];

		const erros: string[] = [];

		validation.finalizarValidacao(camposAValidar, req, erros);
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
			const novoUsuario = await UsuarioService.salvarUsuario(
				req.body.nome,
				req.body.email,
				req.body.senha,
			);
			if (novoUsuario === null) {
				return res.status(400).json({ Message: 'Usuário já está cadastrado!' });
			}
			return res.status(201).json({
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

			validation.finalizarValidacao(camposAValidar, req, erros);
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
				const novoUsuario = await UsuarioService.alterarUsuario(
					id,
					req.body.nome,
					req.body.email,
					req.body.senha,
				);
				if (novoUsuario === null) {
					return res
						.status(400)
						.json({ Message: 'Usuário já está cadastrado!' });
				}
				return res.json({
					Message: 'Usuário alterado com sucesso!',
					data: novoUsuario,
				});
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
			const deletarUsuario = await UsuarioService.deletarUsuario(id);
			if (deletarUsuario) {
				return res.status(404);
			}
			return res.status(404).json({ Message: 'Usuário não Encontrado' });
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
		if (!usuarios) {
			return res.status(404).json('Nenhum usuário foi encontrado!');
		}
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

		validation.finalizarValidacao(camposAValidar, req, erros);
		const errosFiltrados = erros.filter(erro => erro !== '');

		if (errosFiltrados.length > 0) {
			return res.json({ Message: 'Campos inválidos', Errors: errosFiltrados });
		} else {
			const token = await UsuarioService.autenticarUsuario(
				req.body.email,
				req.body.senha,
			);
			if (!token) {
				return res.status(401).json({
					error: 'Login não autorizado',
					message:
						'Credenciais inválidas. Por favor, verifique seu nome de usuário e senha.',
				});
			}
			return res.status(200).json({ token });
		}
	} catch (error) {
		return res.status(500).json(error);
	}
});

export default usuarioRouter;
