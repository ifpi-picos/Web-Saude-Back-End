import { Model } from 'mongoose';
import IClinicaService from './interfaces/IClinicaService';
import IClinica from '../models/interfaces/IClinica';
import Clinica from '../models/Clinica';
import ClinicaRepository from '../repositorys/ClinicaRepository';

class ClinicaService implements IClinicaService {
	private model: Model<IClinica>;

	constructor() {
		this.model = Clinica;
	}
	public async novaClinica(clinicaData: IClinica): Promise<IClinica | null> {
		try {
			const clinicaExistente = await ClinicaRepository.pegarClinica(
				clinicaData.nome,
			);
			if (clinicaExistente) {
				throw new Error('Essa Clínica já está Cadastrada!');
			}
			const novaClinica = this.model.create(clinicaData);
			return novaClinica;
		} catch (error) {
			throw new Error('Erro ao Salvar a Clínica!' + error);
		}
	}

	public async alterarClinica(
		clinicaId: string,
		clinicaData: IClinica,
	): Promise<IClinica | null> {
		try {
			const clinicaExistente = await ClinicaRepository.pegarClinica(
				clinicaData.nome,
			);
			if (clinicaExistente) {
				throw new Error('Essa Clínica já está Cadastrada!');
			}
			const atualizarClinica = await this.model.findByIdAndUpdate(
				clinicaId,
				clinicaData,
				{ new: true },
			);

			return atualizarClinica;
		} catch (error) {
			throw new Error('Erro ao Atualizar a Clínica!' + error);
		}
	}
	public async deletarClinica(clinicaId: string): Promise<void> {
		try {
			await this.model.findByIdAndDelete(clinicaId);
		} catch (error) {
			throw new Error('Erro ao Deletar a Clínica!' + error);
		}
	}
	public async deletarTodasClinicas(): Promise<void> {
		try {
			await this.model.deleteMany({});
		} catch (error) {
			throw new Error('Errro ao Deletar todas as Clínicas!' + error);
		}
	}
}
export default new ClinicaService();
