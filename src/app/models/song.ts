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

  public getYTId() {
    let ytURL = new RegExp(/http(s?):\/\/www.youtube.com\/watch\?v=/);
    let ytShareURL = new RegExp(/(https?:\/\/youtu.be\/)(\w+)(\?t=.*)?/);

    if (ytURL.test(this.url)) {
      return this.url.replace(ytURL, '');
    } else if (ytShareURL.test(this.url)) {
      return this.url.replace(ytShareURL, '$2');
    } else {
      return this.url;
    }
  }

  public makeNewSegmentId() {
    // get the last segment added
    // return it's id plus 1
    let index = this.segments.length;
    if (index === 0) return 1;
    index--;

    return this.segments[index].id + 1;
  }
}

export class SongCollection {
  public songs: Array<Song>;
}
