import IClinica from '@src/models/interfaces/IClinica';
interface IClinicaService {
  cadastrar(clinicaData: IClinica): Promise<IClinica | null>;
  alterarClinica(
    clinicaId: string,
    clinicaData: IClinica,
  ): Promise<IClinica | null>;
  deletarClinica(clinicaId: string): Promise<void>;
  deletarTodasClinicas(): Promise<void>;
}

export default IClinicaService;
