import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ICreateArtistDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
