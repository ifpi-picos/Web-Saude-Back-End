import { Document, Schema } from 'mongoose';
import Iespecialidade from './Iespecialidades';
interface IHospital extends Document {
  nome: string;
  imagem: string;
  longitude: number;
  latitude: number;
  especialidades: Iespecialidade[];
  endereco: Schema.Types.ObjectId;
  instagram: string;
  email: string;
  whatsapp: string;
  descricao: string;
}

export default IHospital;
