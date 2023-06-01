import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './UserModule/User.module';
import { AdminModule } from './AdminModule/admin.module';
import { ProductModule } from './ProductModule/product.module';
import { User } from './UserModule/Entities/User';
import { Product } from './ProductModule/Entities/Product';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationMiddleware } from './Middleware/authentication';
import { HashModule } from './Hashing/hashing.module';
import { ConfigModule } from '@nestjs/config';
import { ProductOrder } from './ProductModule/Entities/ProductOrder';
import { Order } from './ProductModule/Entities/Order';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(
    {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [User,Product,ProductOrder,Order],
    synchronize:true,//you need migrations
    }),
    HashModule,
    UserModule,
    ProductModule,
    AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule 
{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthenticationMiddleware )
      .forRoutes(
        "users",
        "admin",
        "products",
      )
  }

}
