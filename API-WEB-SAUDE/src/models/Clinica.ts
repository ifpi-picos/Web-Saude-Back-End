import { Schema, model } from 'mongoose';
import IClinica from './interfaces/IClinica';

const ClinicaSchema = new Schema<IClinica>({
	nome: {
		type: String,
	},
	imagem: {
		type: String,
	},
	horarioSemana: {
		open: {
			type: String,
		},
		close: {
			type: String,
		},
	},
	Sabado: {
		open: {
			type: String,
		},
		close: {
			type: String,
		},
	},
	longitude: {
		type: Number,
	},
	latitude: {
		type: Number,
	},
	especialidades: [{ type: Schema.Types.ObjectId, ref: 'Especialidade' }],

	instagram: {
		type: String,
	},
	email: {
		type: String,
	},
	whatsapp: {
		type: String,
	},
	descricao: {
		type: String,
	},
	endereco: {
		type: Schema.Types.ObjectId,
		ref: 'Endereco',
	},
});

export default model<IClinica>('Clinica', ClinicaSchema);
