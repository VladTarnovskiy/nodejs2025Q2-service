import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class ICreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  year: number;

  @ValidateIf((_object, value) => value !== null)
  @IsUUID()
  artistId: string | null; // refers to Artist
}

export class IUpdateAlbumDto extends PartialType(ICreateAlbumDto) {}
