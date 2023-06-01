import { PrimaryGeneratedColumn,Column,OneToOne, Entity, JoinColumn, ManyToOne } from "typeorm";
import { Product } from "./Product";
import { Order } from "./Order";
@Entity('productorder')
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
    @OneToOne(()=>Product,{cascade:true})
    @JoinColumn({name:"product_id",referencedColumnName:"id_prod"})
    product:Product;
    @ManyToOne(()=>Order,{cascade:false})
    order:Order;
}