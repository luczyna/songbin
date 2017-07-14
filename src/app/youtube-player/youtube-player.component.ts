import { Component, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Segment } from '../models/segment';
import { PlayerService } from '../player/player.service';

@Component({
  selector: 'yt-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss']
})
export class YoutubePlayerComponent implements OnInit {
  @Input() ytid: string;
  private id: string;

  duration: number;
  ytPlayer: YT.Player;
  segment: Segment = null;
  isLooping: boolean = null;
  timeout: number;
  // we set this to true to ensure we're watching user initiated events
  watchForPlaying: boolean = false;

  segmentSub: Subscription;
  loopingSub: Subscription;

  constructor(private player: PlayerService) {
    this.segmentSub = this.player.activeSegment.subscribe((segment) => {
      this.segment = segment;

      if (segment !== null) {
        this.isLooping = segment.loop;
        if (segment.playing) this.playSegment();
      } else {
        this.isLooping = null;
        this.stopVideo();
      }
    });

    this.loopingSub = this.player.isSegmentLooping.subscribe((isLooping) => {
      this.isLooping = isLooping;
    })
  }

  ngOnInit() {
    this.id = this.trimIdFromYTURL();
  }

  ngOnDestroy() {
    this.segmentSub.unsubscribe();
    this.loopingSub.unsubscribe();
  }

  // ngOnChanges() {
  //   // TODO update the segment when playback is done and it's not looping
  //
  //   if (this.segment) {
  //     if (this.segment.playing) {
  //       console.log('this is playing a song');
  //       this.playSegment();
  //     }
  //
  //     if (this.segment.loop) {
  //       this.setUpSegmentEnd(true);
  //     } else if (!this.segment.loop && this.timeout) {
  //       window.clearTimeout(this.timeout);
  //       this.timeout = null;
  //     }
  //   } else if (this.segment === null) {
  //     // we don't have a segment to play
  //     this.watchForPlaying = false;
  //     this.stopVideo();
  //   }
  // }

  ////// YT Player method abstractions
  ////// for the sake of testing
  public yt = {
    getCurrentTime: (): number => {
      return this.ytPlayer.getCurrentTime();
    },
    getDuration: (): number => {
      return this.ytPlayer.getDuration();
    },
    getPlayerState: (): string => {
      return YT.PlayerState[this.ytPlayer.getPlayerState()];
    },
    pauseVideo: (): void => {
      this.ytPlayer.pauseVideo();
    },
    playVideo: (): void => {
      this.ytPlayer.playVideo();
    },
    seekTo: (when: number, allowSeek?: boolean): void => {
      this.ytPlayer.seekTo(when, allowSeek)
    }
  };

  ////// component logic
  public onStateChange(event) {
    let eventDesc = this.describeEvent(event);
    this.player.updatePlayerStatus(eventDesc);

    // user clicked one of the video controls... ???
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
      if (this.segment && (this.isLooping || this.segment.loop)) {
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

    this.yt.seekTo(this.segment.start, true);
    this.watchForPlaying = true;
    this.yt.playVideo();
  }

  public savePlayer(player) {
    this.ytPlayer = player;
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
      beginning = this.segment.start;
    }

    duration = this.segment.end - beginning;
    // console.log('we will be stopping this in %s seconds', duration);

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

  private describeEvent(event): string {
    let state: string;

    Object.keys(YT.PlayerState).forEach((key) => {
      if (YT.PlayerState[key] === event.data) state = key;
    });

    // console.log('player state', event.data, state);
    return state;
  }
}
