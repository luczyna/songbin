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
  timeout: number;
  // we set this to true to ensure we're watching user initiated events
  watchForPlaying: boolean = false;

  constructor() { }

  ngOnInit() {
    this.id = this.trimIdFromYTURL();
  }

  ngOnChanges() {
    // TODO update the segment when playback is done and it's not looping

    if (this.songSegment) {
      if (this.songSegment.playing) {
        console.log('this is playing a song');
        this.playSegment();
      }

      if (this.songSegment.loop) {
        this.setUpSegmentEnd(true);
      } else if (!this.songSegment.loop && this.timeout) {
        window.clearTimeout(this.timeout);
        this.timeout = null;
      }
    } else if (this.songSegment === null) {
      // we don't have a segment to play
      this.watchForPlaying = false;
      this.stopVideo();
    }
  }

  ////// YT Player method abstractions
  ////// for the sake of testing
  public yt = {
    getCurrentTime: (): number => {
      return this.player.getCurrentTime();
    },
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
  private describeEvent(event): void {
    let state: string;

    Object.keys(YT.PlayerState).forEach((key) => {
      if (YT.PlayerState[key] === event.data) state = key;
    });

    console.log('player state', event.data, state);
  }

  public onStateChange(event) {
    this.describeEvent(event);

    // user clicked one of the video controls...
    // TODO how do we watch this for the SegmentComponent??
    if (!this.watchForPlaying && this.timeout) {
      console.log('***** this was a non-watchForPlaying event *****');
      window.clearTimeout(this.timeout);
      this.timeout = null;
    }

    // if (!this.watchForPlaying) return;

    if (event.data === YT.PlayerState.PLAYING) {
      this.setUpSegmentEnd();
    }

    if (event.data === YT.PlayerState.PAUSED) {
      // TODO we need to communicate to SegmentComponent that it's not playing
      if (this.songSegment && this.songSegment.loop) {
        this.playSegment();
      } else {
        this.watchForPlaying = false;
      }
    }
  }

  public playSegment() {
    if (this.yt.getPlayerState() === 'PLAYING') {
      this.yt.pauseVideo();
    }

    this.yt.seekTo(this.songSegment.start, true);
    this.watchForPlaying = true;
    this.yt.playVideo();
  }

  public savePlayer(player) {
    this.player = player;
    this.setUpVideoInformation();
  }

  public setUpVideoInformation() {
    this.duration = this.yt.getDuration();
  }

  public setUpSegmentEnd(setFromNow:boolean = false) {
    let beginning: number;
    let duration: number;

    if (setFromNow) {
      beginning = this.yt.getCurrentTime();
    } else {
      beginning = this.songSegment.start;
    }

    duration = this.songSegment.end - beginning;
    console.log('we will be stopping this in %s seconds', duration);

    duration *= 1000;

    this.timeout = window.setTimeout(() => this.stopVideo(), duration);
  }

  public stopVideo() {
    this.yt.pauseVideo();
    if (this.timeout) window.clearTimeout(this.timeout);
    this.timeout = null;
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
