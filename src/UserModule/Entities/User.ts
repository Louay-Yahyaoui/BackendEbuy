import { Entity,Column, PrimaryColumn, Timestamp, CreateDateColumn } from "typeorm";
import { Gender } from "./Gender";
import { Role } from "./Role";

@Entity('user')
export class User
{
    @PrimaryColumn({length:50})
    username: string;
    @Column({length:25})
    name:string;
    @Column({length:25})
    lastname:string;
    @Column({unique:true})
    email:string;
    @Column({unique:true})
    tel:Long;
    @Column()
    password:string;
    @Column()
    adress:string;

    role:Role;
    @Column({type:'enum',enum:Gender,enumName:"gender"})
    gender:Gender;
    @CreateDateColumn()
    datejoined:Timestamp;
}