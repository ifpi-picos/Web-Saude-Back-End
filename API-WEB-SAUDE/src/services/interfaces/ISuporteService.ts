import ISuporte from '@src/models/interfaces/ISuporte';
interface ISuporteService {
	enviarMsg(menssagem: ISuporte): Promise<ISuporte | null>;
}

export default ISuporteService;
