import IUsuario from '../../models/interfaces/IUsuario';

interface IUsuarioService {
	salvarUsuario(
		nome: string,
		email: string,
		senha: string,
		senah: string,
	): Promise<IUsuario | null>;
	autenticarUsuario(email: string, senha: string): Promise<string>;
	alterarUsuario(
		id: string,
		nome: string,
		email: string,
		senha: string,
	): Promise<IUsuario | null>;
	alterarSenhaUsuario(id: string, senha: string): Promise<void>;
	deletarUsuario(id: string): Promise<IUsuario | null>;
	deletarTodosUsuarios(): Promise<void>;
}

export default IUsuarioService;
