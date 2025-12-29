import { Injectable, NotFoundException } from '@nestjs/common';
import { ICreateArtistDto } from './dto/artist.dto';
import { IArtist } from './interfaces/artist.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ArtistService {
  constructor(private db: DatabaseService) {}

  async create(createArtistDto: ICreateArtistDto): Promise<IArtist> {
    const artist = await this.db.artist.create({
      data: createArtistDto,
    });
    return artist;
  }

  async findAll(): Promise<IArtist[]> {
    return await this.db.artist.findMany();
  }

  async findOne(id: string): Promise<IArtist> {
    const artist = await this.db.artist.findUnique({
      where: { id },
    });
    if (artist) {
      return artist;
    }
    throw new NotFoundException();
  }

  async update(
    id: string,
    updateArtistDto: ICreateArtistDto,
  ): Promise<IArtist> {
    const artist = await this.findOne(id);
    if (artist) {
      const updatedArtist = await this.db.artist.update({
        where: { id },
        data: updateArtistDto,
      });
      return updatedArtist;
    }
  }

  async remove(id: string) {
    const artist = await this.findOne(id);
    if (artist) {
      await this.db.artist.delete({
        where: { id },
      });
    } else {
      throw new NotFoundException();
    }
  }
}
