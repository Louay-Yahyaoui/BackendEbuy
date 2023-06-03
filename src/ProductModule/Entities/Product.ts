import { User } from "src/UserModule/Entities/User";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";

@Entity("product")
export class Product
{
    @PrimaryGeneratedColumn()
    id_prod:number;
    @Column({unique:true,nullable:false})
    name:string;
    @Column()
    price:number;
    @Column()
    category:string;
    @Column({length:255})
    description:string
    @Column({nullable:true})
    image:string;
    @Column()
    brand:string
    @Column()
    quantity:number;
    @ManyToOne(()=> User,{onDelete:'CASCADE',eager:true})
    owner:User;
}