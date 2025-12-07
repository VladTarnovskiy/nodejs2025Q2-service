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
import { ICreateTrackDto } from './dto/track.dto';
import { TrackService } from './track.service';

@ApiTags('Track')
@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Post()
  @HttpCode(201)
  @ApiOperation({
    summary: 'Add new track',
    description: 'Add new track information',
  })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createTrackDto: ICreateTrackDto) {
    return await this.trackService.create(createTrackDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get tracks list',
    description: 'Gets all library tracks list',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  async findAll() {
    return await this.trackService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get single track by id',
    description: 'Gets single track by id',
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
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.trackService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update track information',
    description: 'Update library track information by UUID',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'The track has been updated.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTrackDto: ICreateTrackDto,
  ) {
    return await this.trackService.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete track',
    description: 'Delete track from library',
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
  @ApiResponse({ status: 404, description: 'Track was not found.' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.trackService.remove(id);
  }
}
