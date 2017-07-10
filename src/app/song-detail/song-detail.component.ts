import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';

import { Song } from '../models/song';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss']
})
export class SongDetailComponent implements OnInit {
  song: Song;
  test: string = 'omg where am I';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        return this.storage.getSong(params.get('id'))
      }).subscribe((song) => this.setSongDetail(song),
                   (error) => this.handleSongError(error));
  }

  public setSongDetail(song: Song): void {
    this.song = song;
  }

  public handleSongError(error: string):void {
    this.router.navigate(['/missing-song']);
  }
}
