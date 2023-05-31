import { CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductOrder } from "./ProductOrder";
@Entity('order')
export class Order
{
    @PrimaryGeneratedColumn()
    id:number;
    @CreateDateColumn()
    date_cmd:Date;
    @OneToMany(()=>ProductOrder,()=>0,{eager:true,onDelete:"RESTRICT"})
    orders:ProductOrder[];
}