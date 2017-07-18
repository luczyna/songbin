export class Segment {
  public name: string;
  public start: number;
  public end: number;
  public loop: boolean;
  public playing: boolean;
  public id: number;

  constructor(name: string, id: number, start: number, end: number, loop: boolean = false, playing: boolean = false) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.loop = loop;
    this.playing = playing;
    this.id = id;
  }
}
