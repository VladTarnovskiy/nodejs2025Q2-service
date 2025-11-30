import { Injectable, NotFoundException } from '@nestjs/common';
import { DataBaseService } from 'src/db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { ICreateAlbumDto, IUpdateAlbumDto } from './dto/album.dto';
import { IAlbum } from './interfaces/album.interface';

@Injectable()
export class AlbumService {
  constructor(private db: DataBaseService) {}

  create(createAlbumDto: ICreateAlbumDto): IAlbum {
    const album = {
      ...createAlbumDto,
      id: uuidv4(),
    };
    this.db.albums.push(album);
    return album;
  }

  findAll(): IAlbum[] {
    return this.db.albums;
  }

  findOne(id: string): IAlbum {
    const album = this.db.albums.find((item) => item.id === id);
    if (album) {
      return album;
    }
    throw new NotFoundException();
  }

  update(id: string, updateAlbumDto: IUpdateAlbumDto): IAlbum {
    const album = this.findOne(id);
    album.name = updateAlbumDto.name;
    album.year = updateAlbumDto.year;
    album.artistId = updateAlbumDto.artistId;
    return album;
  }

  remove(id: string) {
    const album = this.findOne(id);
    if (album) {
      this.db.favorites.albums = this.db.favorites.albums.filter(
        (albumId) => albumId !== id,
      );

      this.db.tracks.forEach((track) => {
        if (track.albumId === id) {
          track.albumId = null;
        }
      });

      this.db.albums = this.db.albums.filter((item) => item.id !== id);
    }
  }
}
