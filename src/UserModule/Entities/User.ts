import { Entity,Column, Timestamp, CreateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Gender } from "./Gender";
import { Role } from "./Role";
import { Cart } from "src/ProductModule/Entities/Cart";

@Entity('user')
export class User
{
    @PrimaryGeneratedColumn()
    id:number;
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
    address:string;
    @Column({type:'enum',enum:Role,select:false,default:Role.User})
    role:Role;
    @Column({type:'enum',enum:Gender,enumName:"gender",default:Gender.Male})
    gender:Gender;
    @CreateDateColumn()
    datejoined:Timestamp;
    @OneToOne(()=>Cart,{cascade:true,onDelete:"CASCADE"})
    @JoinColumn({name:"shopping_cart",referencedColumnName:"id"})
    shoppingcart:Cart;
}