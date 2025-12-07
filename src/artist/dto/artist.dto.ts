import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ICreateArtistDto {
  @ApiProperty({
    description: 'Artist name',
    example: 'Freddie Mercury',
  })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Whether the artist has won a Grammy',
    example: false,
  })
  @IsBoolean()
  grammy: boolean;
}
