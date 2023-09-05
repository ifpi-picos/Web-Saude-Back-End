import Iclinica from '@src/models/interfaces/Iclinica';
interface IClinicaService {
  cadastrar(clinicaData: Iclinica): Promise<Iclinica>;
  alterarClinica(
    clinicaId: string,
    clinicaData: Partial<Iclinica>,
  ): Promise<Iclinica | null>;
  deletarClinica(clinicaId: string): Promise<void>;
  deletarTodasClinicas(): Promise<void>;
}

export default IClinicaService;
