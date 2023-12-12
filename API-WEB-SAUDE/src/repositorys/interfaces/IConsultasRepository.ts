import IClinica from '../../models/interfaces/IClinica';
import IHospital from '../../models/interfaces/IHospital';
import IEspecialidade from '../../models/interfaces/IEspecialidades';

interface IConsultasRepository {
	buscar(nome: string): Promise<(IClinica | IHospital)[] | []>;
	filtrarUnidadesDeSaudePelaEspecialidade(nome: string): Promise<(IClinica | IHospital)[] | []>
	pegarHospitaiseClinicas(): Promise<(IClinica | IHospital)[] | []>;
	pegarHospitalouClinica(nome: string): Promise<IClinica | IHospital | []>;
	pegarEspecialidadesDaUnidadeDeSaude(
		nome: string,
	): Promise<IEspecialidade[] | []>
	contarTotalUnidadesDeSaude(): Promise<number>
	
}
export default IConsultasRepository;
