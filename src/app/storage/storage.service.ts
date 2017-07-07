import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-store';

import { Song } from '../models/song';

@Injectable()
export class StorageService {

  constructor(
    private localStorage: LocalStorageService
  ) { }

  public clearSongs(): void {
    this.localStorage.remove('songs');
  }

  public getSongs(): Array<Song> {
    let songs: Array<Song> = [];
    let storedSongs = this.localStorage.get('songs');

    if (storedSongs !== null) {
      storedSongs.forEach((song) => {
        let datum: Song = {
          name: song.name,
          url: song.url
        };

        songs.push(datum);
      });
    }

    return songs;
  }

  public saveSongs(collection): void {
    this.localStorage.set('songs', collection);
  }

}
