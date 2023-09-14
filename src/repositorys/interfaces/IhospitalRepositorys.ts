import IHospital from "@src/models/interfaces/IHospital";

interface IHospitalRepository {
  pegarHospitais(): Promise<IHospital[]>;
  pegarHospital(nome: string): Promise<IHospital | null>;
  pegarHospitalPelaEspecialidade(nome: string): Promise<IHospital[] | null>;
}

export default IHospitalRepository;
