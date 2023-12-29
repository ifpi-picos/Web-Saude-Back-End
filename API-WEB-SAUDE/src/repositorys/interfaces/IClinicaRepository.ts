import IClinica from '../../models/interfaces/IClinica';

interface IClinicaRepository {
	pegarClinicas(): Promise<IClinica[]>;
	pegarClinica(nome: string): Promise<IClinica | null>;
	
}

export default IClinicaRepository;
