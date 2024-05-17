import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuario } from './Usuario';

interface INotificacoes{
    id:number;
    tipo:string;
    mensagem:string;
    dataCriacao: Date;
    lida: boolean;
    usuario: Usuario;
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
    @ManyToOne(() => Usuario, usuario => usuario.notificacoes, { onDelete: 'CASCADE' })
    usuario: Usuario;
}
