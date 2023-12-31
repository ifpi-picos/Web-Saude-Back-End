import IUsuario from '../../models/interfaces/IUsuario';
import IClinica from '../../models/interfaces/IClinica';
import IHospital from '../../models/interfaces/IHospital';
interface IUsuarioRepository {
	listarUsuarios(): Promise<IUsuario[]>;
	pegarUsuario(id: string): Promise<IUsuario | null>;
	pegarEmail(email: string): Promise<IUsuario | null>;
	pegarunidadesDeSaudeDoUsuario(usuarioId: string): Promise<(IClinica | IHospital)[] | []>
	pegarUsuarioPeloNome(nome: string): Promise<IUsuario | []>
	contarTotalDeUsuarios(): Promise<number>
}
export default IUsuarioRepository;
