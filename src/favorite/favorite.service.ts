import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IFavoriteAllRes } from './interfaces/favorite.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class FavoriteService {
  constructor(private db: DatabaseService) {}

  async addArtist(id: string) {
    const artist = await this.db.artist.findUnique({ where: { id } });
    if (artist) {
      const artistResp = await this.db.artistOnFav.create({
        data: { artistId: id },
      });
      return artistResp;
    }
    throw new UnprocessableEntityException();
  }

  async addAlbum(id: string) {
    const album = await this.db.album.findUnique({ where: { id } });
    if (album) {
      const albumResp = await this.db.albumOnFav.create({
        data: { albumId: id },
      });
      return albumResp;
    }
    throw new UnprocessableEntityException();
  }

  async addTrack(id: string) {
    const track = await this.db.track.findUnique({ where: { id } });
    if (track) {
      const trackResp = await this.db.trackOnFav.create({
        data: { trackId: id },
      });
      return trackResp;
    }
    throw new UnprocessableEntityException();
  }

  async findAll(): Promise<IFavoriteAllRes> {
    const [albumFavs, artistFavs, trackFavs] = await Promise.all([
      this.db.albumOnFav.findMany({ include: { album: true } }),
      this.db.artistOnFav.findMany({ include: { artist: true } }),
      this.db.trackOnFav.findMany({ include: { track: true } }),
    ]);

    const response = {
      albums: albumFavs.map((item) => item.album),
      artists: artistFavs.map((item) => item.artist),
      tracks: trackFavs.map((item) => item.track),
    };

    return response;
  }

  async removeArtist(id: string) {
    const artistInFav = await this.db.artistOnFav.findUnique({
      where: { artistId: id },
    });
    if (artistInFav) {
      await this.db.artistOnFav.delete({ where: { artistId: id } });
    } else {
      throw new NotFoundException();
    }
  }

  async removeAlbum(id: string) {
    const albumInFav = await this.db.albumOnFav.findUnique({
      where: { albumId: id },
    });
    if (albumInFav) {
      await this.db.albumOnFav.delete({ where: { albumId: id } });
    } else {
      throw new NotFoundException();
    }
  }

  async removeTrack(id: string) {
    const trackInFav = await this.db.trackOnFav.findUnique({
      where: { trackId: id },
    });
    if (trackInFav) {
      await this.db.trackOnFav.delete({ where: { trackId: id } });
    } else {
      throw new NotFoundException();
    }
  }
}
