import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity, RegisterResponse } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './entity/auth.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    const user = await this.databaseService.users.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return {
      accessToken: this.jwtService.sign({
        id: user.id,
        name: user.name,
        email: user.email,
      }),
    };
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    const existingUser = await this.databaseService.users.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUsers = await this.databaseService.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    const userResponse: UserResponse = {
      id: newUsers.id,
      name: newUsers.name,
      email: newUsers.email,
      createdAt: newUsers.createdAt,
      updatedAt: newUsers.updatedAt,
    };
    return {
      status: true,
      message: 'register is success',
      data: userResponse,
    };
  }
}
