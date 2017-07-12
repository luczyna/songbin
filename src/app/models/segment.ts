export class Segment {
  public name: string;
  public start: number;
  public end: number;
  public loop: boolean;
  public playing: boolean;

  constructor(name: string, start: number, end: number, loop: boolean = false, playing: boolean = false) {
    this.name = name;
    this.start = start;
    this.end = end;
    this.loop = loop;
    this.playing = playing;
  }
}
