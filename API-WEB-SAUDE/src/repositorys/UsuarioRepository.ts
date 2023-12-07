import { Model } from 'mongoose';
import IUsuario from '../models/interfaces/IUsuario';
import Usuario from '../models/Usuario';
import IUsuarioRepository from './interfaces/IUsuarioRepository';
import IClinica from '../models/interfaces/IClinica';
import IHospital from '../models/interfaces/IHospital';

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

	public async pegarUsuario(id: string): Promise<IUsuario | null> {
		try {
		  const usuario = await this.model.findById(id);
		  if (!usuario) {
			throw new Error('Usuário não encontrado!');
		  }
		  return usuario; 
		} catch (error) {
		  throw new Error('Erro ao buscar o usuário!' + error);
		}
	  }
	  public async pegarUsuarioPeloNome(nome: string): Promise<IUsuario | []> {
		try {
		  const usuario = await this.model.findOne({nome:nome});
		  if (!usuario) {
			return []

		  }
		  return usuario; 
		} catch (error) {
		  throw new Error('Erro ao buscar o usuário!' + error);
		}
	  }
	public async pegarEmail(email: string): Promise<IUsuario | null> {
		try {
			return await this.model.findOne({ email: email });
		} catch (error) {
			throw new Error('Erro ao verificar o Usuário!' + error);
		}
	}
	public async pegarunidadesDeSaudeDoUsuario(usuarioId: string): Promise<(IClinica | IHospital)[] | []> {
		try {

			const usuario = await Usuario.findById(usuarioId).populate({
				path: 'clinicas',
				populate: {
				  path: 'endereco', 
				}}).populate({
					path: 'hospitais',
					populate: {
					  path: 'endereco',
					}})
	
			if (!usuario) {
				return [];
			}
	
			const clinicasDoUsuario: IClinica[] = usuario.clinicas;
			const hospitaisDoUsuario: IHospital[] = usuario.hospitais;
			
			const unidadesDeSaude: (IClinica | IHospital)[] = [...clinicasDoUsuario, ...hospitaisDoUsuario];
			if (unidadesDeSaude.length > 0) {
				
				return unidadesDeSaude;
			}
	
			return [];
		} catch (error) {
			throw error;
		}
	}
}

export default new UsuarioRepository();
