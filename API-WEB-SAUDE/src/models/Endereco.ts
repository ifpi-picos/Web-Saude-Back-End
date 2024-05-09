import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

interface IEndereco {
  id?: number;
  rua: string;
  numero: number;
  cidade: string;
  estado: string;
  cep: string;
  
}

@Entity('Endereco')
export class Endereco implements IEndereco {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  rua: string;

  @Column()
  numero: number;

  @Column()
  cidade: string;

  @Column()
  estado: string;

  @Column()
  cep: string;
}
