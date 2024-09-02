import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany,JoinTable, ManyToOne } from 'typeorm';
import { Usuario } from './Usuario';
import { Endereco } from './Endereco';
import { Especialidade } from './Especialidades';

interface IUnidadeDeSaude {
  id?: number;
  nome: string;
  imagem: string;
  tipo: string;
  horarioSemanaAbre: string;
  horarioSemanaFecha: string;
  horarioSabadoAbre: string;
  horarioSabadoFecha: string;
  email: string;
  whatsapp: string;
  instagram: string;
  descricao: string;
  longitude: number;
  latitude: number;
  aprovado: boolean;
  status: boolean;
  imagens: string[];
  usuario:Usuario;
  endereco:Endereco;

}

@Entity('UnidadesDeSaude')
export class UnidadeDeSaude implements IUnidadeDeSaude {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  nome: string;

  @Column()
  imagem: string;

  @Column()
  tipo: string;

  @Column({default:null})
  horarioSemanaAbre: string;

  @Column({default:null})
  horarioSemanaFecha: string;

  @Column({default:null})
  horarioSabadoAbre: string;

  @Column({default:null})
  horarioSabadoFecha: string;

  @Column({default:null})
  email: string;

  @Column({default:null})
  whatsapp: string;

  @Column({default:null})
  instagram: string;

  @Column({default:null})
  descricao: string;

  @Column({ type: 'double precision',default:null })
  longitude: number;

  @Column({ type: 'double precision',default:null })
  latitude: number;

  @Column('text', { array: true,default:null })
  imagens: string[];

  
  @ManyToOne(() => Usuario, usuario => usuario.unidadesSaude,{onDelete:'CASCADE'})
  @JoinColumn()
  usuario: Usuario;
  
  @OneToOne(() => Endereco ,{cascade:true})
  @JoinColumn()
  endereco: Endereco;
 

  @Column({default:false})
  aprovado:boolean
  
  @Column({ default: false})
  status:boolean

  @ManyToMany(() => Especialidade)
  @JoinTable()
  especialidades: Especialidade[];
}
