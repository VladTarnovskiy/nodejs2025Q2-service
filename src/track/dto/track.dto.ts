import { PartialType } from '@nestjs/mapped-types';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateIf,
} from 'class-validator';

export class ICreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @ValidateIf((_object, value) => value !== null)
  @IsUUID()
  artistId: string | null; // refers to Artist

  @ValidateIf((_object, value) => value !== null)
  @IsUUID()
  albumId: string | null; // refers to Album

  @IsNumber()
  duration: number; // integer number
}

export class IUpdateTrackDto extends PartialType(ICreateTrackDto) {}
