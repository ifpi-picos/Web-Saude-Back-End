import { Document } from 'mongoose';

interface ISuporte extends Document {
	email: string;
	texto: string;
}

export default ISuporte;
