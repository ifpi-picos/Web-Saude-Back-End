import { Document, Schema } from 'mongoose';

interface IEspecialidade extends Document {
	nome: string;
	clinicas: Schema.Types.ObjectId[];
	hospitais: Schema.Types.ObjectId[];
}

export default IEspecialidade;
