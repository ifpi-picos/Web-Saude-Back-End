import IClinica from '../../models/interfaces/IClinica';
import IHospital from '../../models/interfaces/IHospital';

interface IConsultasRepository {
	filtrar(nome: string): Promise<(IClinica | IHospital)[] | []>;
	pegarHospitaiseClinicas(): Promise<(IClinica | IHospital)[] | []>;
	pegarHospitalouClinica(nome: string): Promise<IClinica | IHospital | []>;
	pegarEspecialidadesPeloNomeDaUnidadeDeSaude(nome: string): Promise<string[]>;
}
export default IConsultasRepository;
