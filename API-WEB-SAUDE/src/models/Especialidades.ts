import { Schema, model } from 'mongoose';
import IEspecialidade from './interfaces/IEspecialidades';

const EspecialidadesSchema = new Schema<IEspecialidade>({
	nome: {
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
export default model<IEspecialidade>('Especialidade', EspecialidadesSchema);
