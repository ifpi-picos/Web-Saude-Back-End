import { Model } from 'mongoose';
import IClinica from '../models/interfaces/IClinica';
import IClinicaRepository from './interfaces/IClinicaRepository';
import Clinica from '../models/Clinica';

class ClinicaRepository implements IClinicaRepository {
	private model: Model<IClinica>;

	constructor() {
		this.model = Clinica;
	}
	public async pegarClinicas(): Promise<IClinica[]> {
		try {
			return await this.model
				.find({ aprovado: true })
				.populate('endereco')
				.populate('especialidades');
		} catch (error) {
			throw new Error('Erro ao Listas as Clínicas!' + error);
		}
	}
	public async pegarClinica(nome: string): Promise<IClinica | null> {
		try {
			return await this.model.findOne({ nome: nome }).populate('endereco');
		} catch (error) {
			throw new Error('Erro ao Filtrar a Clínica!' + error);
		}
	}
	public async pegarClinicaPorId(clinicaId: string) {
		try {
			const clinica = await this.model.findById(clinicaId);

			return clinica;
		} catch (error) {
			throw new Error('Erro ao pegar a clínica por ID: ' + error);
		}
	}
}
export default new ClinicaRepository();
