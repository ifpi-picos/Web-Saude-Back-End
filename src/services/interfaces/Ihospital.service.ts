import IHospital from '@src/models/interfaces/Ihospital';

interface IHospitalService {
  cadastrar(hospitalData: IHospital): Promise<IHospital>;
  alterarHospital(
    hospitalId: string,
    clinicaData: Partial<IHospital>,
  ): Promise<IHospital | null>;
  deletarHospital(HospitalId: string): Promise<void>;
  deletarTodaOsHospitais(): Promise<void>;
}

export default IHospitalService;
