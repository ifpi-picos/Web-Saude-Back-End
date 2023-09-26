import { Model } from 'mongoose';
import IEspecialidadesRepositories from './interfaces/IEspecialidadesRepository';
import IEspecialidade from '../models/interfaces/IEspecialidades';
import Especialidades from '../models/Especialidades';

class EspecialidadesRepositorys implements IEspecialidadesRepositories {
	private model: Model<IEspecialidade>;

	constructor() {
		this.model = Especialidades;
	}
	public async pegarEspecialidades(): Promise<IEspecialidade[]> {
		try {
			return await this.model.find({});
		} catch (error) {
			throw new Error('Erro ao Listas as Especialidades!' + error);
		}
	}
	public async pegarEspecialidade(nome: string): Promise<IEspecialidade | null> {
		try {
			return await this.model.findOne({ nome: nome });
		} catch (error) {
			throw new Error('Erro ao Filtrar a Especialidade!' + error);
		}
	}
}

export default new EspecialidadesRepositorys();
