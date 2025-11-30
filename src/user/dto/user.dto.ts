import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ICreateUserDto {
  @ApiProperty({
    description: "The user's login",
    example: 'TestUser',
  })
  @IsString()
  @IsNotEmpty()
  login: string;

  @ApiProperty({
    description: "The user's password",
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
