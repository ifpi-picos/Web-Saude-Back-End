import { Document, Schema } from 'mongoose';
import Iespecialidade from './IEspecialidades';

interface IHospital extends Document {
	nome: string;
	imagem: string;
	horario: string;
	longitude: number;
	latitude: number;
	especialidades: Iespecialidade[];
	endereco: Schema.Types.ObjectId;
	usuario: Schema.Types.ObjectId;
	instagram: string;
	email: string;
	whatsapp: string;
	descricao: string;
	aprovado: boolean;
}

export default IHospital;
