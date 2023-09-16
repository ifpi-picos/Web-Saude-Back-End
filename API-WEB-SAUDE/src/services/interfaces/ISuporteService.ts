import Isuporte from '@src/models/interfaces/ISuporte';
interface IsuporteService {
	enviarMsg(menssagem: Isuporte): Promise<Isuporte>;
}

export default IsuporteService;
