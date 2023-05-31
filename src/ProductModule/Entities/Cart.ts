import { Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductOrder } from "./ProductOrder";

@Entity()
export class Cart
{
    @PrimaryGeneratedColumn()
    id:number;
    @OneToMany(()=>ProductOrder,()=>null,{eager:true,onDelete:"RESTRICT"})
    orders:ProductOrder[];
}