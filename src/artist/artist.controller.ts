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
import { ArtistService } from './artist.service';
import { ICreateArtistDto } from './dto/artist.dto';

@ApiTags('Artist')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Add new artist', description: 'Add new artist' })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  create(@Body() createArtistDto: ICreateArtistDto) {
    return this.artistService.create(createArtistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all artists', description: 'Gets all artists' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  findAll() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single artist by id',
    description: 'Get single artist by id',
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
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update artist information',
    description: 'Update artist information by UUID',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'The artist has been updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateArtistDto: ICreateArtistDto,
  ) {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete artist',
    description: 'Delete artist from library',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Artist was not found.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.artistService.remove(id);
  }
}
