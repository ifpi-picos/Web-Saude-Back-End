import { Schema, model } from 'mongoose';
import IHospital from './interfaces/IHospital';

const HospitalSchema = new Schema<IHospital>({
	nome: {
		type: String,
		required: true,
	},
	imagem: {
		type: String,
	},
	horario: {
		type: String,
		default: 'Atendimento 24 Horas',
	},
	longitude: {
		type: Number,
		required: true,
	},
	latitude: {
		type: Number,
		required: true,
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
	usuario: {
		type: Schema.Types.ObjectId,
		ref: 'Usuario',
	},
	aprovado: {
		type: Boolean,
		default: false,
	  },
	  status:{
		type:Boolean,
		default:true
	},
	tipo:{
		type:String,
		default:"hospital"
	},
	imagens: [{
		type: String,
	  }]
});

export default model<IHospital>('Hospital', HospitalSchema);
