import { IsNotEmpty, IsString } from 'class-validator';

export class ICreateUserDto {
  @IsString()
  @IsNotEmpty()
  login: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
