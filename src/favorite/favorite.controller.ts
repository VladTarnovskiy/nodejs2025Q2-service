import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { IFavoriteAllRes } from './interfaces/favorite.interface';
import { FavoriteService } from './favorite.service';
import { ITrack } from 'src/track/interfaces/track.interface';
import { IAlbum } from 'src/album/interfaces/album.interface';
import { IArtist } from 'src/artist/interfaces/artist.interface';

@ApiTags('Favorites')
@Controller('favs')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post('artist/:id')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Add artist to the favorites',
    description: 'Add artist to the favorites',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Added successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 422, description: "Artist with id doesn't exist." })
  addArtist(@Param('id', ParseUUIDPipe) id: string): IArtist {
    return this.favoriteService.addArtist(id);
  }

  @Post('album/:id')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Add album to the favorites',
    description: 'Add album to the favorites',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Added successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 422, description: "Album with id doesn't exist." })
  addAlbum(@Param('id', ParseUUIDPipe) id: string): IAlbum {
    return this.favoriteService.addAlbum(id);
  }

  @Post('track/:id')
  @HttpCode(201)
  @ApiOperation({
    summary: 'Add track to the favorites',
    description: 'Add track to the favorites',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Added successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. id is invalid (not uuid)',
  })
  @ApiResponse({ status: 422, description: "Track with id doesn't exist." })
  addTrack(@Param('id', ParseUUIDPipe) id: string): ITrack {
    return this.favoriteService.addTrack(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all favorites',
    description: 'Gets all favorites movies, tracks and books',
  })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
  })
  findAll(): IFavoriteAllRes {
    return this.favoriteService.findAll();
  }

  @Delete('artist/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete artist from favorites',
    description: 'Delete artist from favorites',
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
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.removeArtist(id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete album from favorites',
    description: 'Delete album from favorites',
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
  @ApiResponse({ status: 404, description: 'Album was not found.' })
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.removeAlbum(id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  @ApiOperation({
    summary: 'Delete track from favorites',
    description: 'Delete track from favorites',
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
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favoriteService.removeTrack(id);
  }
}
