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

  constructor() { }

  ngOnInit() {
    this.id = this.trimIdFromYTURL();
  }

  onStateChange(event){
    console.log('player state', event.data);
  }

	savePlayer(player) {
    this.player = player;
    console.log('player instance', player)
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
