import { Document, Schema } from 'mongoose';
interface Iendereco extends Document {
  cep: string;
  rua: string;
  numero: Number;
  bairro: string;
  cidade: string;
  uf: string;
  clinica: Schema.Types.ObjectId;
}

export default Iendereco;
