import { Document } from 'mongoose';

interface Isuporte extends Document {
  email: string;
  texto: string;
}

export default Isuporte;
