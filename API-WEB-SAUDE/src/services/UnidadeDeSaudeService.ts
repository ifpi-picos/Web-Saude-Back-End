import { UnidadeDeSaude } from '../models/UnidadeDeSaude';
import { AppDataSource } from '../database/db';
import { ILike } from 'typeorm';

class UnidadeDeSaudeService {
  private unidadeDeSaudeRepository = AppDataSource.getRepository(UnidadeDeSaude);

  async salvarUnidadeDeSaude(unidadeDeSaudeData: Partial<UnidadeDeSaude>): Promise<UnidadeDeSaude | null> {
    try {
        const novaUnidadeDeSaude =  this.unidadeDeSaudeRepository.create(unidadeDeSaudeData);
        const unidadeDeSaudeExistente = await this.unidadeDeSaudeRepository.findOne({where: {nome:unidadeDeSaudeData.nome}})
           
        if (unidadeDeSaudeExistente) {
            return null;
        }
      
        return await this.unidadeDeSaudeRepository.save(novaUnidadeDeSaude);
    } catch (error) {
        console.log(error)
        throw new Error('Houve um Erro Interno no Servidor');
    }
}

async alterarUnidadeDeSaude(id: number, unidadeDeSaudeData: Partial<UnidadeDeSaude>): Promise<UnidadeDeSaude | null> {
    try {
        const unidadeDeSaudeExistente = await this.unidadeDeSaudeRepository.findOne({where:{id}});

        if (unidadeDeSaudeData.nome && unidadeDeSaudeData.nome !== unidadeDeSaudeExistente?.nome) {
            const outraUnidadeDeSaude = await this.unidadeDeSaudeRepository.findOne({ where: { nome: unidadeDeSaudeData.nome } });
            if (outraUnidadeDeSaude) {
                return null
            }
        }

        const unidadeDeSaudeAtualizada = await this.unidadeDeSaudeRepository.save({
            ...unidadeDeSaudeExistente,
            ...unidadeDeSaudeData,
        });

        return unidadeDeSaudeAtualizada;
    } catch (error) {
        console.log(error);
        throw new Error('Houve um Erro Interno no Servidor');
    }
}

async deletarUnidadeDeSaude(id: number): Promise<boolean> {
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
      const unidadesDeSaude = await this.unidadeDeSaudeRepository.find({ relations: ['endereco', 'especialidades','usuario'] });
      return unidadesDeSaude
        
    } catch (error) {
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }
  async pegarUnidadesDeSaudePeloID(id:number): Promise<UnidadeDeSaude | null> {
    try {
      const unidadesDeSaude = await this.unidadeDeSaudeRepository.findOne({where:{id},relations: 
        ['endereco', 'especialidades', 'usuario'

      ]});

      if(!unidadesDeSaude){
        return null
      }
      return unidadesDeSaude
         
    } catch (error) {
        console.log(error)
      throw new Error('Houve um Erro Interno no Servidor');
    }
  }
  async removerEspecialidades(unidadeSaudeId: number, especialidadesIds: number[]):Promise<UnidadeDeSaude> {
    const unidadeSaude = await this.unidadeDeSaudeRepository.findOneOrFail({
        where: { id: unidadeSaudeId },
        relations: ["especialidades"]
    });

    if (!unidadeSaude || !unidadeSaude.especialidades) {
        throw new Error("Unidade de saúde ou especialidades não encontradas");
    }
    unidadeSaude.especialidades = unidadeSaude.especialidades.filter(especialidade => !especialidadesIds.includes(especialidade.id));

   return await this.unidadeDeSaudeRepository.save(unidadeSaude);
}
  async listarUnidadesDeSaudeAprovadas(): Promise<UnidadeDeSaude[]> {
        try {
            const unidadesDeSaudeAprovadas = await this.unidadeDeSaudeRepository.find({
                where: { aprovado: true },relations: ['endereco']
            });

            return unidadesDeSaudeAprovadas;
        } catch (error) {
            throw new Error('Erro ao listar unidades de saúde aprovadas.');
        }
    }
    async listarUnidadeDeSaudepeloNome(nome: string): Promise<UnidadeDeSaude | null> {
        try {
            const unidadesDeSaude = await this.unidadeDeSaudeRepository.findOne({
                where: { nome: ILike(nome)},
                relations: ['endereco','especialidades']
            });
            
            return unidadesDeSaude;
        } catch (error) {
            throw new Error('Erro ao listar unidades de saúde pelo nome.');
        }
    }
    async listarUnidadeDeSaudepeloNomeAprovadas(nome: string): Promise<UnidadeDeSaude | null> {
        try {
            const unidadesDeSaude = await this.unidadeDeSaudeRepository.findOne({
                where: { nome: ILike(nome),aprovado:true },
                relations: ['endereco','especialidades']
            });
            
            return unidadesDeSaude;
        } catch (error) {
            throw new Error('Erro ao listar unidades de saúde pelo nome.');
        }
    }

    async pesquisa(nome: string): Promise<UnidadeDeSaude[]> {
        try {
            const unidadesDeSaude = await this.unidadeDeSaudeRepository.createQueryBuilder("unidadeDeSaude")
                .leftJoinAndSelect("unidadeDeSaude.endereco", "endereco")
                .leftJoinAndSelect("unidadeDeSaude.especialidades", "especialidades")
                .where("unidadeDeSaude.aprovado = true")
                .andWhere(qb => {
                    return qb.where("unidadeDeSaude.nome ILike :termo", { termo: `%${nome}%` })
                        .orWhere("especialidades.nome ILike :termo", { termo: `%${nome}%` });
                })
                .getMany();
             
            return unidadesDeSaude.filter(unidade => unidade.aprovado);
        } catch (error) {
            throw new Error('Erro ao pesquisar unidades de saúde pelo nome.');
        }
    }
    async listarUnidadesDeSaudePorTipo(tipo: string): Promise<UnidadeDeSaude[]> {
        try {
            const unidadesDeSaude = await this.unidadeDeSaudeRepository.find({
                where: { tipo:ILike(tipo),aprovado:true },
                relations: ['endereco', 'especialidades']
            });
            return unidadesDeSaude;
        } catch (error) {
            throw new Error('Erro ao listar unidades de saúde por tipo.');
        }
    }
    
    
}

export default new UnidadeDeSaudeService();
