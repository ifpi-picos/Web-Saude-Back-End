import IUsuario from '../../models/interfaces/IUsuario';
import IClinica from '../../models/interfaces/IClinica';
import IHospital from '../../models/interfaces/IHospital';
interface IUsuarioRepository {
	listarUsuarios(): Promise<IUsuario[]>;
	pegarUsuario(id: string): Promise<void>;
	pegarEmail(email: string): Promise<IUsuario | null>;
	pegarunidadesDeSudeDoUsuario(usuarioId: string): Promise<(IClinica | IHospital)[] | []>
}
export default IUsuarioRepository;
