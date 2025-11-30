import { Injectable } from '@nestjs/common';
import { IAlbum } from 'src/album/interfaces/album.interface';
import { IArtist } from 'src/artist/interfaces/artist.interface';
import { IFavorites } from 'src/favorite/interfaces/favorite.interface';
import { ITrack } from 'src/track/interfaces/track.interface';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class DataBaseService {
  users: IUser[] = [];
  artists: IArtist[] = [];
  albums: IAlbum[] = [];
  tracks: ITrack[] = [];
  favorites: IFavorites = {
    artists: [],
    albums: [],
    tracks: [],
  };
}
