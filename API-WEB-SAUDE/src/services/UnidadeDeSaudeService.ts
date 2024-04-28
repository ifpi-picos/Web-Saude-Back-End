import { UnidadeDeSaude } from '../models/UnidadeDeSaude';
import { AppDataSource } from '../database/db';


class UnidadeDeSaudeService {
  private unidadeDeSaudeRepository = AppDataSource.getRepository(UnidadeDeSaude);

  async salvarUnidadeDeSaude(unidadeDeSaudeData: Partial<UnidadeDeSaude>): Promise<UnidadeDeSaude | null> {
    try {
        const novaUnidadeDeSaude =  this.unidadeDeSaudeRepository.create(unidadeDeSaudeData);
        const unidadeDeSaudeExistente = await this.unidadeDeSaudeRepository.findOne({where: {nome:unidadeDeSaudeData.nome}})
           
        if (unidadeDeSaudeExistente) {
            return null;
        }
        const unidadeSaudeId = 1; // ID da unidade de saúde
   const especialidadesIds = [3]; // IDs das especialidades a serem removidas
  await this.removerEspecialidades(unidadeSaudeId, especialidadesIds);
        return await this.unidadeDeSaudeRepository.save(novaUnidadeDeSaude);
    } catch (error) {
        console.log(error)
        throw new Error('Houve um Erro Interno no Servidor');
    }
}

async alterarUnidadeDeSaude(id: number, unidadeDeSaudeData: Partial<UnidadeDeSaude>): Promise<UnidadeDeSaude> {
    try {
        const unidadeDeSaudeExistente = await this.unidadeDeSaudeRepository.findOne({ where: { id } });
        const unidadeDeSaudeAtualizada = await this.unidadeDeSaudeRepository.save({
            ...unidadeDeSaudeExistente,
            ...unidadeDeSaudeData,
        });


        return unidadeDeSaudeAtualizada;
    } catch (error) {
        throw new Error('Houve um Erro Interno no Servidor');
    }
}

async deletarUnidadeDeSaude(id: number): Promise<Boolean> {
    try {
        const resultado = await this.unidadeDeSaudeRepository.delete(id);
        return resultado.affected === 1;
    } catch (error) {
        throw new Error('Houve um Erro Interno no Servidor');
    }
}

async aprovarUnidadeDeSaude(id: number): Promise<UnidadeDeSaude> {
    try {
        const unidadeDeSaudeExistente = await this.unidadeDeSaudeRepository.findOne({ where: { id } });
        if (!unidadeDeSaudeExistente) {
            throw new Error('Unidade de Saúde não encontrada');
        }
        unidadeDeSaudeExistente.aprovado = true;
        const unidadeDeSaudeAprovada = await this.unidadeDeSaudeRepository.save(unidadeDeSaudeExistente);
        return unidadeDeSaudeAprovada;
    } catch (error) {
        throw new Error('Houve um Erro Interno no Servidor');
    }
}

async listarUnidadesDeSaude(): Promise<UnidadeDeSaude[]> {
    try {
      const unidadesDeSaude = await this.unidadeDeSaudeRepository.find({ relations: ['endereco', 'especialidades'] });
      return unidadesDeSaude
        
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }
  async pegarrUnidadesDeSaudePeloID(id:number): Promise<UnidadeDeSaude | null> {
    try {
      const unidadesDeSaude = await this.unidadeDeSaudeRepository.findOne({ relations: ['endereco', 'especialidades'], where:{id}});
      return unidadesDeSaude
         
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }
  async removerEspecialidades(unidadeSaudeId: number, especialidadesIds: number[]):Promise<UnidadeDeSaude> {
    // 1. Obter a Unidade de Saúde com as especialidades carregadas
    const unidadeSaude = await this.unidadeDeSaudeRepository.findOneOrFail({
        where: { id: unidadeSaudeId },
        relations: ["especialidades"]
    });

    // 2. Verificar se a unidade de saúde e suas especialidades foram carregadas corretamente
    if (!unidadeSaude || !unidadeSaude.especialidades) {
        throw new Error("Unidade de saúde ou especialidades não encontradas");
    }

    // 3. Remover as Especialidades Associadas
    unidadeSaude.especialidades = unidadeSaude.especialidades.filter(especialidade => !especialidadesIds.includes(especialidade.id));

    // 4. Salvar as Alterações
   return await this.unidadeDeSaudeRepository.save(unidadeSaude);
}

}

export default new UnidadeDeSaudeService();
