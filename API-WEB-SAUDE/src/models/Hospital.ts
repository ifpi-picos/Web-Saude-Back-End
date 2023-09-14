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
});

export default model<IHospital>('Hospital', HospitalSchema);
