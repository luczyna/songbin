import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { Song } from '../models/song';
import { Segment } from '../models/segment';

// https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service
@Injectable()
export class PlayerService {
  // Observable state sources
  private currentSongSource = new Subject<Song>();
  private activeSegmentSource = new Subject<Segment>();
  private isSegmentLoopingSource = new Subject<boolean>();
  private currentPlayerStatusSource = new Subject<string>();

  // Observable streams
  currentSong = this.currentSongSource.asObservable();
  activeSegment = this.activeSegmentSource.asObservable();
  isSegmentLooping = this.isSegmentLoopingSource.asObservable();
  currentPlayerStatus = this.currentPlayerStatusSource.asObservable();

  constructor() {}

  removeActiveSegment() {
    this.activeSegmentSource.next(null);
  }

  setActiveSegment(segment: Segment) {
    this.activeSegmentSource.next(segment);
  }

  setCurrentSong(song: Song) {
    this.currentSongSource.next(song);
  }

  updatePlayerStatus(status: string) {
    this.currentPlayerStatusSource.next(status);
  }

  updateLooping(isLooping: boolean) {
    this.isSegmentLoopingSource.next(isLooping);
  }
}
