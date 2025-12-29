import { Injectable, NotFoundException } from '@nestjs/common';
import { ICreateAlbumDto } from './dto/album.dto';
import { IAlbum } from './interfaces/album.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AlbumService {
  constructor(private db: DatabaseService) {}

  async create(createAlbumDto: ICreateAlbumDto): Promise<IAlbum> {
    const album = await this.db.album.create({
      data: createAlbumDto,
    });
    return album;
  }

  async findAll(): Promise<IAlbum[]> {
    return await this.db.album.findMany();
  }

  async findOne(id: string): Promise<IAlbum> {
    const album = await this.db.album.findUnique({ where: { id } });
    if (album) {
      return album;
    }
    throw new NotFoundException();
  }

  async update(id: string, updateAlbumDto: ICreateAlbumDto): Promise<IAlbum> {
    const album = await this.findOne(id);
    if (album) {
      const updatedAlbum = await this.db.album.update({
        where: { id },
        data: updateAlbumDto,
      });
      return updatedAlbum;
    }
  }

  async remove(id: string) {
    const album = await this.findOne(id);
    if (album) {
      await this.db.album.delete({ where: { id } });
    } else {
      throw new NotFoundException();
    }
  }
}
