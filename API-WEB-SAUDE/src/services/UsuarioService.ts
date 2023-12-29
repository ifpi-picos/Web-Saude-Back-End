import { Model } from 'mongoose';
import IUsuario from '../models/interfaces/IUsuario';
import AuthService from './AuthService';
import IUsuarioService from './interfaces/IUsuarioService';
import Usuario from '../models/Usuario';
import UsuarioRepository from '../repositorys/UsuarioRepository';

class UsuarioService implements IUsuarioService {
	private model: Model<IUsuario>;

	constructor() {
		this.model = Usuario;
	}
	public async salvarUsuario(
		nome: string,
		email: string,
		senha: string,
		tipo:string,
	): Promise<IUsuario | null> {
		try {
			const usuarioExistente = await UsuarioRepository.pegarEmail(email);
			const hashedPassword = await AuthService.hashPassword(senha);

			if (usuarioExistente) {
				return null;
			}
			const newUser = await Usuario.create({
				nome,
				email,
				senha: hashedPassword,
				tipo,
			});

			return newUser;
		} catch (error) {
			throw new Error('Erro ao Salvar o Usuário!' + error);
		}
	}

	public async autenticarUsuario(
		email: string,
		senha: string,
	): Promise<string | null> {
		try {
			const token = await AuthService.authenticateUser(email, senha);

			if (token) {
				return token;
			} else {
				return null;
			}
		} catch (error) {
			throw new Error('Erro ao Autenticar o Usuário!' + error);
		}
	}
	public async alterarUsuario(
		id: string,
		nome: string,
		email: string,
		senha: string,
		tipo:string
	): Promise<IUsuario | null> {
		try {
			const usuarioExistente = await UsuarioRepository.pegarEmail(email);
			if (usuarioExistente) {
				return null;
			}
			const usuario = await this.model.findById(id);
			if (!usuario) {
				throw new Error('Usuário não Encontrado!');
			}

			usuario.nome = nome;
			usuario.email = email;
			usuario.tipo = tipo;

			if (senha) {
				const hashedPassword = await AuthService.hashPassword(senha);
				usuario.senha = hashedPassword;
			}

			await usuario.save();

			return usuario;
		} catch (error) {
			throw new Error('Erro ao Alterar o Usuário!' + error);
		}
	}
	public async alterarSenhaUsuario(nome: string, senha: string): Promise<void> {
		try {
			const usuario = await Usuario.findOne({nome:nome});
			if (!usuario) {
				throw new Error('Usuário não Encontrado!');
			}

			const hashedPassword = await AuthService.hashPassword(senha);
			usuario.senha = hashedPassword;

			await usuario.save();
		} catch (error) {
			throw new Error('Erro ao Alterar a Senha do Usuário!' + error);
		}
	}

	public async deletarUsuario(id: string): Promise<IUsuario | null> {
		try {
			return await this.model.findByIdAndDelete(id);
		} catch (error) {
			throw new Error('Erro ao Deletar o Usuário!' + error);
		}
	}

	
	public async adicionarClinicaAoUsuario(
		usuario: string,
		ClinicaId: string,
	): Promise<void> {
		try {
			await this.model.updateOne(
				{ _id: usuario },
				{ $push: { clinicas: ClinicaId } },
			);
		} catch (error) {
			throw new Error('Erro ao adicionar a nova clínica á seu Usuário!');
		}
	}
	public async removerclinicaDoUsuario(
		usuario: string,
		clinicaId: string,
	): Promise<void> {
		try {
			await this.model.updateOne(
				{ _id: { $in: usuario } },
				{ $pull: { clinicas: clinicaId } },
			);
		} catch (error) {
			throw new Error('Erro ao remover a clínica do usuário!' + error);
		}
	}
	public async adicionarHospitalAoUsuario(
		usuario: string,
		hosptialId: string,
	): Promise<void> {
		try {
			await this.model.updateOne(
				{ _id: usuario },
				{ $push: { hospitais: hosptialId } },
			);
		} catch (error) {
			throw new Error('Erro ao adicionar o novo Hospital a seu Usuário!');
		}
	}
	public async removerHospitalDoUsuario(
		usuario: string,
		hosptialId: string,
	): Promise<void> {
		try {
			await this.model.updateOne(
				{ _id: { $in: usuario } },
				{ $pull: { hospitais: hosptialId } },
			);
		} catch (error) {
			throw new Error('Erro ao remover o hospital do Usuário" ' + error);
		}
	}
   
}

export default new UsuarioService();
