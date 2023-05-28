import { UUID } from "crypto";
import { Column, Double, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export class Product
{
    @PrimaryGeneratedColumn('uuid')
    id_prod:UUID;
    @Column()
    name:string;
    @Column({type:'double'})
    prix:Double;
    @Column()
    category:string;
    @Column({length:255})
    description:string
    @Column()
    image:string;
    @Column()
    Marque:string
    @Column()
    quantity:string;
}