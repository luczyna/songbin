import { Component, OnInit, Input } from '@angular/core';

import { Subscription } from 'rxjs/Subscription';

import { Segment } from '../models/segment';
import { PlayerService } from '../player/player.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {
  @Input() segment: Segment;

  playerStatusSub: Subscription;
  activeLoopingSub: Subscription;
  activeSegmentSub: Subscription;

  isActiveSegment: boolean = false;
  activeSegmentIsLooping: boolean = null;
  disableInteractions: boolean = false;

  constructor(private player: PlayerService) {
    this.playerStatusSub = this.player.currentPlayerStatus.subscribe((status) => {
      if (status === 'PAUSED' && !this.activeSegmentIsLooping) {
        if (this.isActiveSegment) this.segment.playing = false;
        this.disableInteractions = false;
      }
    });

    this.activeSegmentSub = this.player.activeSegment.subscribe((segment) => {
      // TODO consider putting an id on segment
      this.isActiveSegment = (this.segment === segment);
      this.disableInteractions = (segment === null) ? false : !this.isActiveSegment;
    });

    this.activeLoopingSub = this.player.isSegmentLooping.subscribe((isLooping) => {
      console.log('segment: active segment is looping: %s', isLooping);
      this.activeSegmentIsLooping = isLooping;
    });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.playerStatusSub.unsubscribe();
    this.activeSegmentSub.unsubscribe();
    this.activeLoopingSub.unsubscribe();
  }

  deleteSegment(): void {}

  editSegment(): void {}

  playSegment(): void {
    this.segment.playing = !this.segment.playing;

    if (this.segment.playing) {
      this.player.setActiveSegment(this.segment);
      this.player.updateLooping(this.segment.loop);
    } else {
      this.player.removeActiveSegment();
    }
  }

  toggleLooping(): void {
    this.segment.loop = !this.segment.loop;

    if (this.segment.playing && this.isActiveSegment) {
      this.player.updateLooping(this.segment.loop);
    }
  }
}
