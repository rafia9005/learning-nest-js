import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, ProductModule, AuthModule],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
