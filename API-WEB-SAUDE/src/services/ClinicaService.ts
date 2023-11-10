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
				return null;
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
				return null;
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

	public async deletarClinica(clinicaId: string): Promise<IClinica | null> {
		try {
			return await this.model.findByIdAndDelete(clinicaId);
		} catch (error) {
			throw new Error('Erro ao Deletar a Clínica!' + error);
		}
	}
}
export default new ClinicaService();
