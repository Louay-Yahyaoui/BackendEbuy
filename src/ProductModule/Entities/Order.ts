import { CreateDateColumn, Entity,  ManyToOne, OneToMany, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { ProductOrder } from "./ProductOrder";
import { User } from "src/UserModule/Entities/User";
@Entity('order')
export class Order
{
    @PrimaryGeneratedColumn()
    id:number;
    @CreateDateColumn()
    date_cmd:Timestamp;
    @OneToMany(()=>ProductOrder,(orders:ProductOrder)=>orders.order,{eager:true,onDelete:"CASCADE"})
    orders:ProductOrder[];
    @ManyToOne(()=>User,(user:User)=>user.history,{cascade:true,onDelete:"CASCADE"})
    user:User;
}