import { Injectable, NotFoundException } from '@nestjs/common';
import { ICreateTrackDto } from './dto/track.dto';
import { ITrack } from './interfaces/track.interface';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TrackService {
  constructor(private db: DatabaseService) {}

  async create(createTrackDto: ICreateTrackDto): Promise<ITrack> {
    const track = await this.db.track.create({
      data: createTrackDto,
    });
    return track;
  }

  async findAll(): Promise<ITrack[]> {
    return await this.db.track.findMany();
  }

  async findOne(id: string): Promise<ITrack> {
    const track = await this.db.track.findUnique({ where: { id } });

    if (track) {
      return track;
    }
    throw new NotFoundException();
  }

  async update(id: string, updateTrackDto: ICreateTrackDto): Promise<ITrack> {
    const track = await this.findOne(id);
    if (track) {
      const updatedTrack = await this.db.track.update({
        where: { id },
        data: updateTrackDto,
      });
      return updatedTrack;
    }
  }

  async remove(id: string) {
    const track = await this.findOne(id);
    if (track) {
      await this.db.track.delete({ where: { id } });
    } else {
      throw new NotFoundException();
    }
  }
}
