import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class VerifyTokenService {
  private transporter;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string) {
    const mailOptions = {
      from: '"Your App Name" <your_email@example.com>',
      to: to,
      subject: 'Email Verification',
      text: `Your verification code is: ${token}`,
      html: `
    <html>
    <body>
      <p>Your verification code is: <strong>${token}</strong></p>
    </body>
    </html>
  `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
    } catch (error) {
      console.error('Error sending email: ' + error);
    }
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
