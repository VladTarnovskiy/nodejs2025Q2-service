import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IUserAuthDto {
  @ApiProperty({
    description: 'User login',
    example: 'test_user',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
