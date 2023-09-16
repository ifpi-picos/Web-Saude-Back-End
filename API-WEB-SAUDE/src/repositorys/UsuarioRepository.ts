import { Model } from 'mongoose';
import IUsuario from '../models/interfaces/IUsuario';
import Usuario from '../models/Usuario';
import IUsuarioRepository from './interfaces/IUsuarioRepository';

class UsuarioRepository implements IUsuarioRepository {
	private model: Model<IUsuario>;

	constructor() {
		this.model = Usuario;
	}
	async listarUsuarios(): Promise<IUsuario[]> {
		try {
			return await this.model.find();
		} catch (error) {
			throw new Error('Erro ao Listar os Usuários!' + error);
		}
	}

	public async pegarUsuario(id: string): Promise<void> {
		try {
			const usuario = await this.model.findById(id);
			if (!usuario) {
				throw new Error('Usuário já está cadastrado!');
			}
		} catch (error) {
			throw new Error('Erro ao Buscar o Usuário!' + error);
		}
	}
	public async pegarEmail(email: string): Promise<void> {
		try {
			const usuario = await this.model.findOne({ email: email });

			if (usuario) {
				throw new Error('Esse Email já está Registrado!');
			}
		} catch (error) {
			throw new Error('Erro ao verificar o Usuário!' + error);
		}
	}
}

export default new UsuarioRepository();
