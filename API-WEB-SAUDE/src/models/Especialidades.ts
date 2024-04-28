import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { UnidadeDeSaude } from './UnidadeDeSaude';

interface IEspecialidade {
  id?: number;
  nome: string;
}

@Entity('Especialidades')
export class Especialidade implements IEspecialidade {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @ManyToMany(() => UnidadeDeSaude)
  unidadesSaude: UnidadeDeSaude[];
}
