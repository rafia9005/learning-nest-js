import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity, RegisterResponse } from './entity/auth.entity';
import * as bcrypt from 'bcrypt';
import { UserResponse } from './entity/auth.entity';
import { VerifyTokenService } from 'src/middleware/verify-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
    private readonly emailService: VerifyTokenService,
  ) {}

  async login(email: string, password: string): Promise<AuthEntity> {
    if (!email) {
      throw new NotFoundException('Email must be provided');
    }

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
      token: this.jwtService.sign({
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
    if (!email) {
      throw new ConflictException('Email must be provided');
    }

    const existingUser = await this.databaseService.users.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.databaseService.users.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    const verifyToken = Math.floor(100000 + Math.random() * 900000).toString();

    await this.databaseService.verifyToken.create({
      data: {
        token: verifyToken,
        usersId: newUser.id,
      },
    });

    await this.emailService.sendVerificationEmail(newUser.email, verifyToken);

    const userResponse: UserResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    const accessToken = this.jwtService.sign({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    });

    return {
      status: true,
      message: `Registration successful. Please check your email to verify your account. ${newUser.email}`,
      token: accessToken,
      data: userResponse,
    };
  }
  async verifyToken(
    token: string,
    bearerToken: string,
  ): Promise<{ status: boolean; message: string }> {
    const decoded = this.jwtService.decode(bearerToken) as { id: number };

    if (!decoded || !decoded.id) {
      throw new BadRequestException('Invalid token');
    }

    const userId = decoded.id;

    const verifyToken = await this.databaseService.verifyToken.findUnique({
      where: { usersId: userId },
    });

    if (!verifyToken || verifyToken.token !== token) {
      throw new NotFoundException('Invalid verification token');
    }

    await this.databaseService.users.update({
      where: { id: userId },
      data: { verify: true },
    });

    return {
      status: true,
      message: 'Account successfully verified',
    };
  }
}
