import { Injectable, NotFoundException } from '@nestjs/common';
import { DataBaseService } from 'src/db/db.service';
import { v4 as uuidv4 } from 'uuid';
import { ICreateTrackDto, IUpdateTrackDto } from './dto/track.dto';
import { ITrack } from './interfaces/track.interface';

@Injectable()
export class TrackService {
  constructor(private db: DataBaseService) {}

  create(createTrackDto: ICreateTrackDto): ITrack {
    const track = {
      ...createTrackDto,
      id: uuidv4(),
    };
    this.db.tracks.push(track);
    return track;
  }

  findAll(): ITrack[] {
    return this.db.tracks;
  }

  findOne(id: string): ITrack {
    const track = this.db.tracks.find((item) => item.id === id);
    if (track) {
      return track;
    }
    throw new NotFoundException();
  }

  update(id: string, updateTrackDto: IUpdateTrackDto): ITrack {
    const track = this.findOne(id);
    track.name = updateTrackDto.name;
    track.artistId = updateTrackDto.artistId;
    track.albumId = updateTrackDto.albumId;
    track.duration = updateTrackDto.duration;
    return track;
  }

  remove(id: string) {
    const track = this.findOne(id);
    if (track) {
      this.db.favorites.tracks = this.db.favorites.tracks.filter(
        (trackId) => trackId !== id,
      );

      this.db.tracks = this.db.tracks.filter((item) => item.id !== id);
    }
  }
}
