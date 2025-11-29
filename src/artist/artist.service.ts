import { Injectable, NotFoundException } from '@nestjs/common';
import { DataBaseService } from 'src/db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { ICreateArtistDto, IUpdateArtistDto } from './dto/artist.dto';
import { IArtist } from './interfaces/artist.interface';

@Injectable()
export class ArtistService {
  constructor(private db: DataBaseService) {}

  create(createArtistDto: ICreateArtistDto): IArtist {
    const artist = {
      ...createArtistDto,
      id: uuidv4(),
    };
    this.db.artists.push(artist);
    return artist;
  }

  findAll(): IArtist[] {
    return this.db.artists;
  }

  findOne(id: string): IArtist {
    const artist = this.db.artists.find((item) => item.id === id);
    if (artist) {
      return artist;
    }
    throw new NotFoundException();
  }

  update(id: string, updateArtistDto: IUpdateArtistDto): IArtist {
    const artist = this.findOne(id);
    artist.name = updateArtistDto.name;
    artist.grammy = updateArtistDto.grammy;
    return artist;
  }

  remove(id: string) {
    const artist = this.findOne(id);
    if (artist) {
      this.db.artists = this.db.artists.filter((item) => item.id !== id);
    }
  }
}
