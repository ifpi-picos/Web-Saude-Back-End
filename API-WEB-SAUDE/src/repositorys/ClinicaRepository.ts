import { Model } from 'mongoose';
import IClinica from '../models/interfaces/IClinica';
import IClinicaRepository from './interfaces/IClinicaRepository';
import Clinica from '../models/Clinica';
import EspecialidadesRepository from './EspecialidadesRepository';

class ClinicaRepository implements IClinicaRepository {
	private model: Model<IClinica>;

	constructor() {
		this.model = Clinica;
	}
	public async pegarClinicas(): Promise<IClinica[]> {
		try {
			return await this.model
				.find()
				.populate('endereco')
				.populate('especialidades');
		} catch (error) {
			console.log(error);
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
	public async pegarClinicaPelaEspecialidade(
		nome: string,
	): Promise<IClinica[] | null> {
		try {
			const especialidade = await EspecialidadesRepository.pegarEspecialidade(
				nome,
			);
			if (!especialidade) {
				throw new Error('Especialidade não Encontrada!');
			}
			const clinicas = await this.model.find({}).populate('especialidades');
			const clinicasFiltradas = clinicas.filter(clinica =>
				clinica.especialidades.some(
					especialidadeClinica =>
						especialidadeClinica._id.toString() === especialidade._id.toString(),
				),
			);
			return clinicasFiltradas;
		} catch (error) {
			throw new Error('Erro ao Filtrar as Clínicas pela Especialidades!' + error);
		}
	}
}
export default new ClinicaRepository();
