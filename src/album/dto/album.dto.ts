import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ICreateAlbumDto {
  @ApiProperty({
    description: 'Album name',
    example: 'Innuendo',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Album release year',
    example: 1991,
  })
  @IsNumber()
  year: number;

  @ApiProperty({
    description: 'Artist ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
    required: false,
  })
  @ValidateIf((_object, value) => value !== null)
  @IsUUID()
  artistId: string | null; // refers to Artist
}
