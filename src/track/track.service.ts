import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

export interface Track {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

@Injectable()
export class TrackService {
  private readonly tracks: Map<string, Track> = new Map();

  getAll(): Track[] {
    return Array.from(this.tracks.values());
  }

  getById(id: string): Track {
    return this.tracks.get(id);
  }

  createTrack(dto: CreateTrackDto): Track {
    const id = uuidv4();
    const newTrack: Track = {
      id,
      ...dto,
    };

    this.tracks.set(id, newTrack);

    return newTrack;
  }

  updateTrack(dto: UpdateTrackDto, id: string): Track {
    const track = this.getById(id);

    track.name = dto.name;
    track.artistId = dto.artistId;
    track.albumId = dto.albumId;
    track.duration = dto.duration;

    return track;
  }

  deleteTrack(id: string) {
    this.tracks.delete(id);
  }
}
