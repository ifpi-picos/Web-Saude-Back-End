import { Document, Schema } from 'mongoose';
import IEspecialidade from './IEspecialidades';
interface IClinica extends Document {
	nome: string;
	imagem: string;
	horarioSemana: {
		open: string;
		close: string;
	};
	sabado: {
		open: string;
		close: string;
	};
	longitude: number;
	latitude: number;
	especialidades: IEspecialidade[];
	endereco: Schema.Types.ObjectId;
	usuario: Schema.Types.ObjectId;
	instagram: string;
	email: string;
	whatsapp: string;
	descricao: string;
	aprovado: boolean;
	status: boolean;
	tipo: string;
	imagens?: string[];
}

export default IClinica;
