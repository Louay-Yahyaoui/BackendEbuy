import { Entity,Column, Timestamp, CreateDateColumn, PrimaryGeneratedColumn } from "typeorm";
import { Gender } from "./Gender";
import { Role } from "./Role";

@Entity('user')
export class User
{
    @PrimaryGeneratedColumn("uuid")
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
    tel:Long;
    @Column({select:false})
    password:string;
    @Column()
    adress:string;

    role:Role;
    @Column({type:'enum',enum:Gender,enumName:"gender"})
    gender:Gender;
    @CreateDateColumn()
    datejoined:Timestamp;
}