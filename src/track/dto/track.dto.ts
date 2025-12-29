import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ICreateTrackDto {
  @ApiProperty({
    description: 'Track name',
    example: 'The Show Must Go On',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Artist ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
    required: false,
  })
  @ValidateIf((_object, value) => value !== null)
  @IsUUID()
  artistId: string | null; // refers to Artist

  @ApiProperty({
    description: 'Album ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    nullable: true,
    required: false,
  })
  @ValidateIf((_object, value) => value !== null)
  @IsUUID()
  albumId: string | null; // refers to Album

  @ApiProperty({
    description: 'Track duration in seconds',
    example: 262,
  })
  @IsNumber()
  duration: number; // integer number
}
