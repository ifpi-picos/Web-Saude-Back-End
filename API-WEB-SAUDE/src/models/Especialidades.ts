import { Schema, model } from 'mongoose';
import IEspecialidade from './interfaces/IEspecialidades';

const EspecialidadesSchema = new Schema<IEspecialidade>({
	nome: {
		type: String,
		required: true,
	},
});
export default model<IEspecialidade>('Especialidade', EspecialidadesSchema);
