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
    this.id = this.ytid;
  }

  ngOnDestroy() {
    this.segmentSub.unsubscribe();
    this.loopingSub.unsubscribe();
  }

  ////// component logic
  public describeEvent(event): string {
    let state: string;

    Object.keys(YT.PlayerState).forEach((key) => {
      if (YT.PlayerState[key] === event.data) state = key;
    });

    // console.log('player state', event.data, state);
    return state;
  }

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

    // PLAYING
    if (event.data === 1) {
      this.setUpSegmentEnd();
    }

    // PAUSED
    if (event.data === 2) {
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

  public setUpSegmentEnd() {
    let duration: number;

    duration = this.segment.end - this.segment.start;
    duration *= 1000;

    this.timeout = window.setTimeout(() => this.stopVideo(), duration);
  }

  public stopVideo() {
    this.yt.pauseVideo();
    if (this.timeout) window.clearTimeout(this.timeout);
    this.timeout = null;
  }

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
}
