import { ApiProperty } from '@nestjs/swagger';

export class AuthEntity {
  @ApiProperty()
  accessToken: string;
}

export class RegisterResponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: object;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}
