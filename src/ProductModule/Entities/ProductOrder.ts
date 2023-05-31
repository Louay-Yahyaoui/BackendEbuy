import { PrimaryGeneratedColumn,Column,OneToOne, Entity } from "typeorm";
import { Product } from "./Product";
@Entity()
export class ProductOrder
{
    constructor(product:Product,quantity:number) {
        this.product=product;
        this.quantity=quantity;
    }
    @PrimaryGeneratedColumn()
    id:number;
    @Column()
    quantity:number;
    @OneToOne(()=>Product,{})
    product:Product;
}