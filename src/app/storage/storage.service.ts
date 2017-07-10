import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-store';

import { Song, SongCollection } from '../models/song';

@Injectable()
export class StorageService {
  collection: SongCollection;

  constructor(
    private localStorage: LocalStorageService
  ) {
    this.collection = {
      songs: this.getSongsFromStorage()
    };
  }

  public clearSongs(): void {
    this.localStorage.remove('songs');
    this.collection = {
      songs: this.getSongsFromStorage()
    };
  }

  public getSongs(): Array<Song> {
    return this.collection.songs;
  }

  public saveSongs(): void {
    this.localStorage.set('songs', this.collection.songs);
  }

  private getSongsFromStorage() {
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
}
