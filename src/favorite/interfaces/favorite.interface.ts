import { IAlbum } from 'src/album/interfaces/album.interface';
import { IArtist } from 'src/artist/interfaces/artist.interface';
import { ITrack } from 'src/track/interfaces/track.interface';

export interface IFavorites {
  artists: string[]; // favorite artists ids
  albums: string[]; // favorite albums ids
  tracks: string[]; // favorite tracks ids
}

export interface IFavoriteAllRes {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}
