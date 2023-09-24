import ISuporte from '../../models/interfaces/ISuporte';

interface ISuporteRepository {
	mensagensRecebidoas(): Promise<ISuporte[]>;
}

export default ISuporteRepository;
