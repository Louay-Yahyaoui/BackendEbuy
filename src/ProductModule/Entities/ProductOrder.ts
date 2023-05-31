import { PrimaryGeneratedColumn,Column,OneToOne, Entity } from "typeorm";
import { Product } from "./Product";
@Entity()
export class ProductOrder
{
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    quantitiy:number;
    @OneToOne(()=>Product,{})
    product:Product;
}