import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'yt-player',
  templateUrl: './youtube-player.component.html',
  styleUrls: ['./youtube-player.component.scss']
})
export class YoutubePlayerComponent implements OnInit {
  @Input() ytid: string;

  private id: string;
  player: YT.Player;
  duration: number;
  segments = [];
  watchForPlaying: boolean = false;

  constructor() { }

  ngOnInit() {
    this.id = this.trimIdFromYTURL();
  }

  onStateChange(event){
    console.log('player state', event.data);

    // PLAYING
    if (this.watchForPlaying && event.data === 1) {
      console.log('we will be stopping this in 10 secinds');
      window.setTimeout(() => this.stopVideo(), 1000 * 10);
    }

    // PAUSED
    if (this.watchForPlaying && event.data === 2) {
      // window.setTimeout(() => this.stopVideo);
    }
  }

	savePlayer(player) {
    this.player = player;
    console.log('player instance', player)

    this.duration = this.player.getDuration();
    this.prepareSegments();
	}

  public playSegment(segmentIndex: number) {
    let segmentStart = this.segments[segmentIndex][0];
    console.log('playing the segment at ', segmentStart);

    if (this.player.getPlayerState() === 1) {
      console.log('pausing currently playing video');
      this.player.pauseVideo();
    }

    this.player.seekTo(segmentStart, false);

    this.watchForPlaying = true;
    this.player.playVideo();
  }

  public prepareSegments(): void {
    let start = 0;
    let count = Math.floor(this.duration / 10);
    let remainder;

    for (var i = 0; i < count; i++) {
      let seg = [];
      start = i;
      seg[0] = (i === 0) ? (start) : (start * 10) + 1
      seg[1] = (start + 1) * 10;

      this.segments.push(seg);
    }

    remainder = this.duration % 10;
    if (remainder) {
      this.segments.push([this.duration - remainder, this.duration]);
    }
  }

  public stopVideo() {
    this.player.stopVideo();
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
