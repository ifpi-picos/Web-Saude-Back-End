import { Schema, model, Document } from 'mongoose';
import IUsuario from './interfaces/IUsuario';

const usuarioModel = new Schema<IUsuario>({
	nome: {
		type: String,
	},
	email: {
		type: String,
	},
	senha: {
		type: String,
		required: true,
	},
	clinicas: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Clinica',
		},
	],
	hospitais: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Hospital',
		},
	],
});

export default model<IUsuario & Document>('Usuario', usuarioModel);
