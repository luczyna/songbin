import { Component, OnInit } from '@angular/core';

import { Song } from '../models/song';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit {
  collection: Array<Song>;

  constructor(private storage: StorageService) {
    this.collection = this.storage.getSongs()
  }

  ngOnInit() {
  }

}
