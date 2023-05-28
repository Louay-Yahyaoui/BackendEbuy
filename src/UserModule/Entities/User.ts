import { Entity,Column, Timestamp, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "./Gender";
import { Role } from "./Role";

@Entity('user')
export class User
{
    @PrimaryGeneratedColumn('uuid')
    id:string;
    @Column({length:50,unique:true})
    username: string;
    @Column({length:25})
    name:string;
    @Column({length:25})
    lastname:string;
    @Column({unique:true})
    email:string;
    @Column({unique:true})
    tel:string;
    @Column({select:false})
    password:string;
    @Column()
    adress:string;
    @Column({type:'enum',enum:Role,select:false,default:Role.User})
    role:Role;
    @Column({type:'enum',enum:Gender,enumName:"gender",default:Gender.Male})
    gender:Gender;
    @CreateDateColumn()
    datejoined:Timestamp;
}