import Isuporte from '@src/models/interfaces/Isuporte';
interface IsuporteService {
  enviarMsg(menssagem: Isuporte): Promise<Isuporte>;
}

export default IsuporteService;
