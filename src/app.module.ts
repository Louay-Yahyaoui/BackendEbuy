import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './UserModule/User.module';
import { AdminModule } from './AdminModule/admin.module';
import { ProductModule } from './ProductModule/product.module';

@Module({
  imports: [UserModule,ProductModule,AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
