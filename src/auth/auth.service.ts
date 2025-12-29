import {
  Injectable,
  ForbiddenException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IAuthLogin } from './interfaces/auth.interface';
import { IUserAuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from './interfaces/jwt.interface';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signup(registerDto: IUserAuthDto) {
    const existingUser = await this.userService.findByLogin(registerDto.login);

    if (existingUser) {
      throw new BadRequestException('User with this login already exists');
    }
    const cryptSalt = this.configService.get('cryptSalt', 10);

    const hashedPassword = await bcrypt.hash(registerDto.password, cryptSalt);

    const user = await this.userService.create({
      login: registerDto.login,
      password: hashedPassword,
    });

    return {
      id: user.id,
      message: 'User created successfully',
    };
  }

  async login(loginDto: IUserAuthDto): Promise<IAuthLogin> {
    const user = await this.userService.findByLogin(loginDto.login);

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
      userId: user.id,
      login: user.login,
    };

    const tokens = this.generateTokens(accessPayload);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private generateTokens(payload: JwtPayload) {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwtExpiresIn', '1h'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwtExpiresInRefresh', '24h'),
      secret: this.configService.get('jwtSecretRefresh'),
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateUser(payload: JwtPayload) {
    const user = await this.userService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async refresh(refreshToken?: string) {
    if (!refreshToken) {
      throw new UnauthorizedException();
    }

    try {
      const payload: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwtSecretRefresh'),
      });
      const user = await this.userService.findOne(payload.userId);

      if (!user) {
        throw new UnauthorizedException();
      }

      return this.generateTokens({
        userId: user.id,
        login: user.login,
      });
    } catch (e) {
      throw new ForbiddenException('Refresh token invalid or expired');
    }
  }
}
