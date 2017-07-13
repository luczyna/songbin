import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { Segment } from '../models/segment';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {
  @Input() segment: Segment;
  // @Output() onPlayToggle = new EventEmitter(<Segment>);
  @Output() onPlayToggle = new EventEmitter();
  constructor() { }

  ngOnInit() {

  }

  deleteSegment(): void {}

  editSegment(): void {}

  playSegment(): void {
    this.segment.playing = !this.segment.playing;
    this.onPlayToggle.emit(this.segment);
  }

  toggleLooping(): void {
    // TODO will we need to emit an onplayToggle event here, too?
    this.segment.loop = !this.segment.loop;
  }
}
