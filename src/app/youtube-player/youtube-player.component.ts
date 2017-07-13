import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'yt-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss']
})
export class YoutubePlayerComponent implements OnInit {
  @Input() ytid: string;
  @Input() songSegment;

  private id: string;
  player: YT.Player;

  duration: number;
  timeout;
  watchForPlaying: boolean = false;

  constructor() { }

  ngOnInit() {
    this.id = this.trimIdFromYTURL();
  }

  ngOnChanges() {
    // TODO disable the inputs on the segment until the youtube player is loaded
    console.log('this is on checking');

    if (this.songSegment) {
      if (this.songSegment.playing) {
        console.log('this is playing a song');
        this.playSegment();
      }
    }
  }

  ////// YT Player method abstractions
  ////// for the sake of testing
  public yt = {
    getDuration: (): number => {
      return this.player.getDuration();
    },
    getPlayerState: (): string => {
      return YT.PlayerState[this.player.getPlayerState()];
    },
    pauseVideo: (): void => {
      this.player.pauseVideo();
    },
    playVideo: (): void => {
      this.player.playVideo();
    },
    seekTo: (when: number, allowSeek?: boolean): void => {
      this.player.seekTo(when, allowSeek)
    }
  };

  ////// component logic
  public onStateChange(event){
    console.log('player state', event.data);

    // PLAYING
    if (this.watchForPlaying && event.data === 1) {
      let duration = this.songSegment.end - this.songSegment.start;
      console.log('we will be stopping this in %s seconds', duration);
      this.timeout = window.setTimeout(() => this.yt.pauseVideo(), 1000 * duration);
    }

    // PAUSED
    if (this.watchForPlaying && event.data === 2) {
      // window.setTimeout(() => this.stopVideo);
    }
  }

  public playSegment() {
    if (this.yt.getPlayerState() === 'PLAYING') {
      this.yt.pauseVideo();
    }

    this.yt.seekTo(this.songSegment.start, false);

    this.watchForPlaying = true;
    this.yt.playVideo();
  }

  // public prepareSegments(): void {
  //   let start = 0;
  //   let count = Math.floor(this.duration / 10);
  //   let remainder;
  //
  //   for (var i = 0; i < count; i++) {
  //     let seg = [];
  //     start = i;
  //     seg[0] = (i === 0) ? (start) : (start * 10) + 1
  //     seg[1] = (start + 1) * 10;
  //
  //     this.segments.push(seg);
  //   }
  //
  //   remainder = this.duration % 10;
  //   if (remainder) {
  //     this.segments.push([this.duration - remainder, this.duration]);
  //   }
  // }

  public savePlayer(player) {
    this.player = player;
    this.setUpVideoInformation();
  }

  public setUpVideoInformation() {
    this.duration = this.yt.getDuration();
    // this.prepareSegments();
  }

  public stopVideo() {
    this.yt.pauseVideo();
    this.watchForPlaying = false;
  }

  public trimIdFromYTURL(): string {
    let ytURL = new RegExp(/http(s?):\/\/www.youtube.com\/watch\?v=/);
    if (ytURL.test(this.ytid)) {
      return this.ytid.replace(ytURL, '');
    } else {
      return this.ytid;
    }
  }
}
