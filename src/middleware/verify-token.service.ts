import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as nodemailer from 'nodemailer';
import { DatabaseService } from 'src/database/database.service';
import * as ejs from 'ejs';
import * as fs from 'fs';
import { join } from 'path';

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
      from: `"${process.env.APP_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`,
      to: to,
      subject: 'Email Verification',
      text: `Your verification code is: ${token}`,
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            width: 100%;
            padding: 20px;
            text-align: center;
          }
          h1 {
            color: #333333;
            font-size: 24px;
          }
          .code {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
            margin: 20px 0;
          }
          .footer {
            font-size: 14px;
            color: #777777;
            margin-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Email Verification</h1>
          <p>Please use the following verification code to complete your registration:</p>
          <div class="code">${token}</div>
          <p class="footer">If you didn’t request this verification, please ignore this email.</p>
        </div>
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
