import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreateUserDto } from './dto/user.dto';
import { IUpdatePasswordDto } from './dto/password.dto';
import { IUser } from './interfaces/user.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async create(
    createUserDto: ICreateUserDto,
  ): Promise<Omit<IUser, 'password'>> {
    const createdUser = await this.db.user.create({
      data: createUserDto,
      omit: { password: true },
    });
    return {
      ...createdUser,
      createdAt: createdUser.createdAt.getTime(),
      updatedAt: createdUser.updatedAt.getTime(),
    };
  }

  async findAll(): Promise<Omit<IUser, 'password'>[]> {
    const users = await this.db.user.findMany({ omit: { password: true } });
    return users.map((user) => ({
      ...user,
      createdAt: user.createdAt.getTime(),
      updatedAt: user.updatedAt.getTime(),
    }));
  }

  async findOne(id: string): Promise<Omit<IUser, 'password'>> {
    const user = await this.db.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    if (user) {
      return {
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
    }
    throw new NotFoundException();
  }

  async update(
    id: string,
    updatePasswordDto: IUpdatePasswordDto,
  ): Promise<Omit<IUser, 'password'>> {
    const user = await this.db.user.findUnique({
      where: { id },
    });
    if (user) {
      if (user.password === updatePasswordDto.oldPassword) {
        const updatedUser = await this.db.user.update({
          where: { id },
          data: {
            version: user.version + 1,
            password: updatePasswordDto.newPassword,
          },
          omit: { password: true },
        });
        return {
          ...updatedUser,
          createdAt: updatedUser.createdAt.getTime(),
          updatedAt: updatedUser.updatedAt.getTime(),
        };
      }
      throw new ForbiddenException();
    }
    throw new NotFoundException();
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.db.user.delete({ where: { id } });
  }

  async findByLogin(login: string) {
    const user = await this.db.user.findUnique({
      where: { login },
    });

    return user;
  }
}
