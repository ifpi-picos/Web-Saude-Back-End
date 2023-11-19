import IUsuario from '../../models/interfaces/IUsuario';

interface IUsuarioService {
	salvarUsuario(
		nome: string,
		email: string,
		senha: string,
		senah: string,
	): Promise<IUsuario | null>;
	autenticarUsuario(email: string, senha: string): Promise<string | null>;
	alterarUsuario(
		id: string,
		nome: string,
		email: string,
		senha: string,
	): Promise<IUsuario | null>;
	alterarSenhaUsuario(id: string, senha: string): Promise<void>;
	deletarUsuario(id: string): Promise<IUsuario | null>;
	adicionarClinicaAoUsuario(
		usuario: string,
		ClinicaId: string,
	): Promise<void>
	removerclinicaDoUsuario(
		usuario: string,
		clinicaId: string,
	): Promise<void>
	adicionarHospitalAoUsuario(
		usuario: string,
		hosptialId: string,
	): Promise<void>
	
	removerHospitalDoUsuario(
		usuario: string,
		hosptialId: string,
	): Promise<void>
}
 
export default IUsuarioService;
