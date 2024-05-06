import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UnidadeDeSaude } from './UnidadeDeSaude';

interface IUsuario {
  id: number; 
  nome: string;
  imagem: string;
  email: string;
  senha: string;
  tipo: string;
  status: boolean;
}

@Entity('Usuario')
export class Usuario implements IUsuario {
  @PrimaryGeneratedColumn('increment')
  id: number; 

  @Column()
  nome: string;

  @Column({nullable:true})
  imagem: string;

  @Column()
  email: string;

  @Column()
  senha: string;

  @Column()
  tipo: string; 
  
  @Column({default:false})
  status: boolean;

  @OneToMany(() => UnidadeDeSaude, unidadeSaude => unidadeSaude.usuario,{cascade:true})
  unidadesSaude: UnidadeDeSaude[];
  
}
