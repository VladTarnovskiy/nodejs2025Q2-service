import { Injectable } from '@nestjs/common';
import { IUser } from 'src/user/interfaces/user.interface';

@Injectable()
export class DataBaseService {
  users: IUser[] = [];
}
