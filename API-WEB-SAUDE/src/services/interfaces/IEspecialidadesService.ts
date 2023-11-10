import IEspecialidade from '../../models/interfaces/IEspecialidades';

interface IEspecailidadesService {
	novaEspecailidade(
		especialidadeData: IEspecialidade,
	): Promise<IEspecialidade | null>;
	atualizarEspecailidade(
		especialidadeID: string,
		especialidadeData: IEspecialidade,
	): Promise<IEspecialidade | null>;
	adicionarClinicaAEspecialidades(
		especialidadesIds: string[],
		novaClinicaId: string,
	): Promise<void>;
	adicionarHospitaisAEspecialidades(
		especialidadesIds: string[],
		novoHospitalId: string,
	): Promise<void>;
	deletarEspecialidade(especialidadeID: string): Promise<IEspecialidade | null>;
	deletarTodasEspecialidade(): Promise<void>;
	removerclinicaDasEspecialidades(
		cliincalId: string,
		especialidadesIds: string[],
	): Promise<void>;
	removerHospitaisDasEspecialidades(
		hospitalId: string,
		especialidadesIds: string[],
	): Promise<void>;
}

export default IEspecailidadesService;
