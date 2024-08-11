import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ProductModule } from './product/product.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users/users.controller';
import { VerifyTokenService } from './middleware/verify-token.service';
import { JwtModule } from '@nestjs/jwt';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ProductModule,
    AuthModule,
    JwtModule,
    ReviewModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, VerifyTokenService],
})
export class AppModule {}
