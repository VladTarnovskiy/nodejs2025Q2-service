import { Injectable } from '@nestjs/common';
import { IArtist } from 'src/artist/interfaces/artist.interface';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class DataBaseService {
  users: IUser[] = [];
  artists: IArtist[] = [];
}
