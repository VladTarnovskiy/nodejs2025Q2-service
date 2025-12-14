import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { IUserAuthDto } from './dto/auth.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'User registration',
    description: 'User registration',
  })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  async signup(@Body() registerDto: IUserAuthDto) {
    return await this.authService.signup(registerDto);
  }

  @Get()
  @ApiOperation({ summary: 'User login', description: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  async login(@Body() loginDto: IUserAuthDto) {
    return await this.authService.login(loginDto);
  }
}
