import { Entity, PrimaryGeneratedColumn, Column,} from 'typeorm';

interface INotificacoes{
    id:number;
    tipo:string;
    mensagem:string;
    dataCriacao: Date;
    lida: boolean;
}

@Entity('Notificacoes')
export class Notificacoes implements INotificacoes{

    @PrimaryGeneratedColumn('increment')
    id: number;
    @Column()
    tipo: string;
    @Column()
    mensagem: string;
    @Column()
    dataCriacao: Date;
    @Column({default:false})
    lida: boolean;
}
