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
      throw new BadRequestException('Email must be provided');
    }

    const user = await this.databaseService.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`No user found for email: ${email}`);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.generateToken(user);
    return { token };
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<RegisterResponse> {
    if (!email) {
      throw new BadRequestException('Email must be provided');
    }

    const existingUser = await this.databaseService.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.databaseService.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const verifyToken = this.generateVerificationToken();

    await this.databaseService.verifyToken.create({
      data: {
        token: verifyToken,
        usersId: newUser.id,
      },
    });

    await this.emailService.sendVerificationEmail(newUser.email, verifyToken);

    const userResponse: UserResponse = this.createUserResponse(newUser);
    const accessToken = this.generateToken(newUser);

    return {
      status: true,
      message: `Registration successful. Please check your email to verify your account ${newUser.email}`,
      token: accessToken,
      data: userResponse,
    };
  }

  async verifyToken(
    token: string,
    bearerToken: string,
  ): Promise<{ status: boolean; message: string }> {
    const decoded = this.decodeToken(bearerToken);

    if (!decoded || !decoded.id) {
      throw new BadRequestException('Invalid token');
    }

    const verifyToken = await this.databaseService.verifyToken.findUnique({
      where: { usersId: decoded.id },
    });

    if (!verifyToken || verifyToken.token !== token) {
      throw new NotFoundException('Invalid verification token');
    }

    await this.databaseService.users.update({
      where: { id: decoded.id },
      data: { verify: true },
    });

    return {
      status: true,
      message: 'Account successfully verified',
    };
  }

  private generateToken(user: any): string {
    return this.jwtService.sign({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  private generateVerificationToken(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private createUserResponse(user: any): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
