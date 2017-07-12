import { Segment } from './segment';

export class Song {
  public url: string;
  public name: string;
  public id: string;
  public segments: Array<Segment>;

  constructor(name: string, url: string, id: string, segments: Array<Segment> = []) {
    this.url = url;
    this.name = name;
    this.id = id;
    this.segments = segments;
  }
}

export class SongCollection {
  public songs: Array<Song>;
}
