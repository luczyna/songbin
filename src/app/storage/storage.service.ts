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

  public getSong(songId: string): Promise<Song> {
    let matchedSong: Song;

    this.collection.songs.forEach((song: Song) => {
      if (song.id === songId) {
        matchedSong = song;
      }
    });

    if (typeof matchedSong !== 'undefined') {
      return Promise.resolve(matchedSong);
    } else {
      return Promise.reject('no songs match');
    }
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
        let datum: Song = new Song(song.name, song.url, song.id, song.segments);

        songs.push(datum);
      });
    }

    return songs;
  }
}
