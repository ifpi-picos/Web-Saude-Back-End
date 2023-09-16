import IEspecialidade from '../models/interfaces/IEspecialidades';
import IEspecailidadesService from './interfaces/IEspecialidadesService';
import { Model } from 'mongoose';
import Especialidades from '../models/Especialidades';
import EspecialidadesRepository from '../repositorys/EspecialidadesRepository';

class EspecialidadesServices implements IEspecailidadesService {
	private model: Model<IEspecialidade>;

	constructor() {
		this.model = Especialidades;
	}
	public async novaEspecailidade(
		especialidadeData: IEspecialidade,
	): Promise<IEspecialidade | null> {
		try {
			const especialidadeExistente =
				await EspecialidadesRepository.pegarEspecialidade(
					especialidadeData.nome,
				);
			if (especialidadeExistente) {
				throw new Error('Essa especialidade já está Cadastrada!');
			}
			return await this.model.create(especialidadeData);
		} catch (error) {
			throw new Error('Erro ao Salvar uma nova Especialidade!' + error);
		}
	}
	public async atualizarEspecailidade(
		especialidadeID: string,
		especialidadeData: IEspecialidade,
	): Promise<IEspecialidade | null> {
		try {
			const especialidadeExistente =
				await EspecialidadesRepository.pegarEspecialidade(
					especialidadeData.nome,
				);
			if (especialidadeExistente) {
				throw new Error('Essa especialidade já está Cadastrada!');
			}
			return await this.model.findByIdAndUpdate(
				especialidadeID,
				especialidadeData,
				{ new: true },
			);
		} catch (error) {
			throw new Error('Erro ao atualizar uma nova Especialidade!' + error);
		}
	}
	public async deletarEspecialidade(especialidadeID: string): Promise<void> {
		try {
			await this.model.findByIdAndDelete(especialidadeID);
		} catch (error) {
			throw new Error('Erro ao Deletar uma Especialidade!' + error);
		}
	}
	public async deletarTodasEspecialidade(): Promise<void> {
		try {
			await this.model.deleteMany({});
		} catch (error) {
			throw new Error('Erro ao Deletar todas as Especialidade!' + error);
		}
	}
}

export default new EspecialidadesServices();
