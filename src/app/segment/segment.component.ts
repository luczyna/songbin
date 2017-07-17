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

  constructor(public player: PlayerService) {}

  ngOnInit() {
    this.playerStatusSub = this.player.currentPlayerStatus.subscribe((status) => {
      if (status === 'PAUSED' && !this.activeSegmentIsLooping) {
        // please refer to #toggleLooping
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
      this.activeSegmentIsLooping = isLooping;
    });
  }

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

    // while this MAY seem redundant (can a non-playing segment be active, truely)?
    // this double check is in place due to a check happening above
    // in this.playerStatusSub: Subscription
    //   we are checking to see if a non-looping segment
    //   that is "this" one is done playing (paused)
    //   so we can update this component instance settings for the view
    if (this.segment.playing && this.isActiveSegment) {
      this.player.updateLooping(this.segment.loop);
    }
  }
}
