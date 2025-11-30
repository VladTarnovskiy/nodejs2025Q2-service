import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { ICreateUserDto } from './dto/user.dto';
import { IUpdatePasswordDto } from './dto/password.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created.',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: ICreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single user by id',
    description: 'Get single user by id',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: "Update a user's password",
    description: "Updates a user's password by ID",
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 403, description: 'oldPassword is wrong' })
  @ApiResponse({ status: 404, description: 'User not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: IUpdatePasswordDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete user', description: 'Deletes user by ID.' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'The user has been deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
