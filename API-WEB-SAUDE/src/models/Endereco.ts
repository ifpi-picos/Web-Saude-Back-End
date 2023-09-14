import { Document, Schema, model } from 'mongoose';
import IEndereco from '../models/interfaces/IEndereco';

const EnderecoSchema = new Schema<IEndereco>({
  cep: {
    type: String,
    required: true,
  },
  rua: {
    type: String,
    required: true,
  },
  numero: {
    type: Number,
    required: true,
  },
  bairro: {
    type: String,

    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  uf: {
    type: String,
    required: true,
  },
});

export default model<IEndereco & Document>('Endereco', EnderecoSchema);
