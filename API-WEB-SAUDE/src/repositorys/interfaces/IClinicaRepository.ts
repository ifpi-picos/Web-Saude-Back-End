import IClinica from '../../models/interfaces/IClinica';

interface IClinicaRepository {
	pegarClnicas(): Promise<IClinica[]>;
	pegarClinica(nome: string): Promise<IClinica | null>;
	pegarClinicaPelaEspecialidade(nome: string): Promise<IClinica[] | null>;
}

export default IClinicaRepository;
