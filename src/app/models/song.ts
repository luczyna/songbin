import { Segment } from './segment';

export class Song {
  public url: string;
  public name: string;
  public id: string;
  public segments: Array<Segment>;

  constructor(name: string, url: string, id: string, segments: Array<Segment> = []) {
    if (typeof name === 'undefined' || !name.length) {
      throw new ReferenceError('a name is required for a Song');
    }

    if (typeof url === 'undefined' || !url.length) {
      throw new ReferenceError('a url is required for a Song');
    }

    if (typeof id === 'undefined' || !id.length) {
      throw new ReferenceError('an id is required for a Song');
    }

    // TODO how to test segment validity?
    // if (segments.length) throw new Error('a name is required for a Song');

    this.url = url;
    this.name = name;
    this.id = id;
    this.segments = segments;
  }
}

export class SongCollection {
  public songs: Array<Song>;
}
