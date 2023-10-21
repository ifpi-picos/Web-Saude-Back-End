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
	deletarEspecialidade(especialidadeID: string): Promise<IEspecialidade | null>;
	deletarTodasEspecialidade(): Promise<void>;
}

export default IEspecailidadesService;
