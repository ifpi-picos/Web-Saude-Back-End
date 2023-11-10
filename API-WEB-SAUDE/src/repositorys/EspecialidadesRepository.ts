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
	public async pegarEspecialidade(
		nome: string,
	): Promise<IEspecialidade | null> {
		try {
			return await this.model.findOne({ nome: nome });
		} catch (error) {
			throw new Error('Erro ao Filtrar a Especialidade!' + error);
		}
	}

	public async listarIdsDasEspecialidadesPorClinica(
		clinicaId: string,
	): Promise<string[]> {
		try {
			const especialidades = await this.model.find(
				{ clinicas: clinicaId },
				'_id',
			);
			const especialidadesIds = especialidades.map(especialidade =>
				especialidade._id.toString(),
			);
			return especialidadesIds;
		} catch (error) {
			throw new Error('Erro ao listar as especialidades da clínica: ' + error);
		}
	}
	public async listarIdsDasEspecialidadesPorHospital(
		hospitalId: string,
	): Promise<string[]> {
		try {
			const especialidades = await this.model.find(
				{ hospitais: hospitalId },
				'_id',
			);
			const especialidadesIds = especialidades.map(especialidade =>
				especialidade._id.toString(),
			);
			return especialidadesIds;
		} catch (error) {
			throw new Error('Erro ao listar as especialidades do hospital: ' + error);
		}
	}
}

export default new EspecialidadesRepositorys();
