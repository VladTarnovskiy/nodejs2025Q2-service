import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IAlbum } from 'src/album/interfaces/album.interface';
import { IArtist } from 'src/artist/interfaces/artist.interface';
import { DataBaseService } from 'src/db/db.service';
import { ITrack } from 'src/track/interfaces/track.interface';
import { IFavoriteAllRes } from './interfaces/favorite.interface';

@Injectable()
export class FavoriteService {
  constructor(private db: DataBaseService) {}

  addArtist(id: string) {
    const artist = this.db.artists.find((artist) => artist.id === id);
    if (artist) {
      if (!this.db.favorites.artists.includes(id)) {
        this.db.favorites.artists.push(id);
      }
      return artist;
    }
    throw new UnprocessableEntityException();
  }

  addAlbum(id: string) {
    const album = this.db.albums.find((album) => album.id === id);
    if (album) {
      if (!this.db.favorites.albums.includes(id)) {
        this.db.favorites.albums.push(id);
      }
      return album;
    }
    throw new UnprocessableEntityException();
  }

  addTrack(id: string) {
    const track = this.db.tracks.find((track: ITrack) => track.id === id);
    if (track) {
      if (!this.db.favorites.tracks.includes(id)) {
        this.db.favorites.tracks.push(id);
      }
      return track;
    }
    throw new UnprocessableEntityException();
  }

  findAll(): IFavoriteAllRes {
    const arrOfArtists = this.db.favorites.artists
      .map((artistId) =>
        this.db.artists.find((artist: IArtist) => artist.id === artistId),
      )
      .filter(Boolean);
    const arrOfAlbums = this.db.favorites.albums
      .map((albumId) =>
        this.db.albums.find((album: IAlbum) => album.id === albumId),
      )
      .filter(Boolean);
    const arrOfTracks = this.db.favorites.tracks
      .map((trackId) =>
        this.db.tracks.find((track: ITrack) => track.id === trackId),
      )
      .filter(Boolean);

    return {
      artists: arrOfArtists,
      albums: arrOfAlbums,
      tracks: arrOfTracks,
    };
  }

  removeArtist(id: string) {
    const artistInFav = this.db.favorites.artists.includes(id);
    if (artistInFav) {
      this.db.favorites.artists = this.db.favorites.artists.filter(
        (artistId) => artistId !== id,
      );
    } else {
      throw new NotFoundException();
    }
  }

  removeAlbum(id: string) {
    const albumInFav = this.db.favorites.albums.includes(id);
    if (albumInFav) {
      this.db.favorites.albums = this.db.favorites.albums.filter(
        (albumId) => albumId !== id,
      );
    } else {
      throw new NotFoundException();
    }
  }

  removeTrack(id: string) {
    const trackInFav = this.db.favorites.tracks.includes(id);
    if (trackInFav) {
      this.db.favorites.tracks = this.db.favorites.tracks.filter(
        (trackId) => trackId !== id,
      );
    } else {
      throw new NotFoundException();
    }
  }
}
