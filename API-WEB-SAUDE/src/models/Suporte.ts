import { model,Schema } from "mongoose";
import ISuporte from "./interfaces/ISuporte";

const suporteSchema = new Schema<ISuporte>({

    nome:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
    },
    mensagem:{
        type:String,
        required:true
    }
})

export default model<ISuporte>('Suporte',suporteSchema)