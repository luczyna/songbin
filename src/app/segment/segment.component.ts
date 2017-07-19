import { Component, OnInit,
         Input, Output, EventEmitter } from '@angular/core';

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
  @Output() onRemoveSegment = new EventEmitter();

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
      if (segment === null) {
        this.isActiveSegment = false;
        this.disableInteractions = false;
      } else {
        this.isActiveSegment = (this.segment.id === segment.id);
        this.disableInteractions = !this.isActiveSegment;
      }
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

  deleteSegment(): void {
    if (this.segment.playing) this.playSegment();
    this.onRemoveSegment.emit(this.segment.id);
  }

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

    // while this MAY seem redundant
    // (can a non-playing segment be active, truely)?
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
