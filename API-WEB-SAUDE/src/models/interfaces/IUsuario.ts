import { Document } from 'mongoose';
import IHospital from './IHospital';
import IClinica from './IClinica';
interface Iusuario extends Document {
	nome: string;
	email: string;
	senha: string;
	clinicas: IClinica[];
	hospitais: IHospital[];
	tipo:string;
}
export default Iusuario;
