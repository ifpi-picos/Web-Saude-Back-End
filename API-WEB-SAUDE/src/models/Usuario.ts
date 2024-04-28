import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UnidadeDeSaude } from './UnidadeDeSaude';

interface IUsuario {
  id?: number; 
  nome: string;
  imagem: string;
  email: string;
  senha: string;
  tipo: string;
}

@Entity('Usuario')
export class Usuario implements IUsuario {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column()
  nome: string;

  @Column()
  imagem: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  tipo: string; 

  @OneToMany(() => UnidadeDeSaude, unidadeSaude => unidadeSaude.usuario)
  unidadesSaude: UnidadeDeSaude[];
}
