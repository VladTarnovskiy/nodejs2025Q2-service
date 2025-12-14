import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IAuthLogin } from './interfaces/auth.interface';
import { DatabaseService } from 'src/database/database.service';
import { IUserAuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';

export interface JwtPayload {
  sub: string;
  login: string;
}

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async signup(registerDto: IUserAuthDto) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const authData = await this.db.registration.create({
      data: {
        login: registerDto.login,
        password: hashedPassword,
      },
    });
    return {
      message: 'User created successfully',
      login: authData.login,
    };
  }

  async login(loginDto: IUserAuthDto): Promise<IAuthLogin> {
    const user = await this.db.registration.findUnique({
      where: { login: loginDto.login },
    });

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new ForbiddenException('Authentication failed');
    }

    const accessPayload: JwtPayload = {
      sub: user.id,
      login: user.login,
    };

    return {
      access_token: this.jwtService.sign(accessPayload),
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.db.registration.findUnique({
      where: { id: payload.sub },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
