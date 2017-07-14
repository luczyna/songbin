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
    // TODO update the segment when playback is done and it's not looping
    console.log('this is on checking');

    if (this.songSegment) {
      if (this.songSegment.playing) {
        console.log('this is playing a song');
        this.playSegment();
      } else {
        this.yt.pauseVideo();
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
    if (this.watchForPlaying && event.data === YT.PlayerState.PLAYING) {
      let duration = this.songSegment.end - this.songSegment.start;
      console.log('we will be stopping this in %s seconds', duration);
      this.timeout = window.setTimeout(() => this.player.pauseVideo(), 1000 * duration);
    }

    // PAUSED
    // TODO we're just trying to get the looping to happen
    // using the watchForPlaying, we need this to be different
    if (this.watchForPlaying && event.data === YT.PlayerState.PAUSED) {
      console.log('we should be restarting this');
      // window.setTimeout(() => this.stopVideo);
      this.player.seekTo(this.songSegment.start, true);
      this.player.playVideo();
    }
  }

  public playSegment() {
    if (this.yt.getPlayerState() === 'PLAYING') {
      this.yt.pauseVideo();
    }

    // this.yt.seekTo(this.songSegment.start, true).then(() => {
    //   this.watchForPlaying = true;
    //   this.yt.playVideo();
    // });

    // this.player.seekTo(this.songSegment.start, true).then(() => {
    //   this.watchForPlaying = true;
    //   this.player.playVideo();
    // });

    this.player.seekTo(this.songSegment.start, true);
    this.watchForPlaying = true;
    this.player.playVideo();
  }

  public savePlayer(player) {
    this.player = player;
    this.setUpVideoInformation();
  }

  public setUpVideoInformation() {
    this.duration = this.yt.getDuration();
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
