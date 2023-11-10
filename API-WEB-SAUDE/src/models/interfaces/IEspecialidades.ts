import { Document, Schema } from 'mongoose';
import IHospital from './IHospital';
import IClinica from './IClinica';
interface IEspecialidade extends Document {
	nome: string;
	clinicas: IClinica[];
	hospitais: IHospital[];
}

export default IEspecialidade;
