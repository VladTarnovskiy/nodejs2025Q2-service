import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataBaseService } from 'src/db/db.service';
import { ICreateUserDto } from './dto/user.dto';
import { IUpdatePasswordDto } from './dto/password.dto';
import { IUser } from './interfaces/user.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private db: DataBaseService) {}

  create(createUserDto: ICreateUserDto): Omit<IUser, 'password'> {
    const user = {
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      id: uuidv4(),
    };
    this.db.users.push(user);
    const userResp = { ...user };
    delete userResp.password;
    return userResp;
  }

  findAll(): Omit<IUser, 'password'>[] {
    return this.db.users.map((item) => ({
      createdAt: item.createdAt,
      id: item.id,
      login: item.login,
      updatedAt: item.updatedAt,
      version: item.version,
    }));
  }

  findOne(id: string): IUser {
    const user = this.db.users.find((item) => item.id === id);
    if (user) {
      const userResp = { ...user };
      delete userResp.password;
      return userResp;
    }
    throw new NotFoundException();
  }

  update(id: string, updatePasswordDto: IUpdatePasswordDto): IUser {
    const user = this.db.users.find((item) => item.id === id);
    if (user) {
      if (user.password === updatePasswordDto.oldPassword) {
        user.password = updatePasswordDto.newPassword;
        user.version += 1;
        user.updatedAt = Date.now();
        const userResp = { ...user };
        delete userResp.password;
        return userResp;
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }

  remove(id: string) {
    const user = this.findOne(id);
    if (user) {
      this.db.users = this.db.users.filter((item) => item.id !== id);
    }
  }
}
