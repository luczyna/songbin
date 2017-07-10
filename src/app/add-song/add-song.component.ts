import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Song } from '../models/song';
import { StorageService } from '../storage/storage.service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})

export class AddSongComponent implements OnInit {
  collection: Array<Song>;
  songForm: FormGroup;

  // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  urlRegex: RegExp = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
  urlValidator = Validators.pattern(this.urlRegex);

  constructor(
    private formBuilder: FormBuilder,
    private storage: StorageService
  ) {
    this.buildForm();
    this.collection = this.storage.getSongs();
  }

  ngOnInit() {}

  addingSong() {
    const newSong: Song = {
      name: this.songForm.get('name').value,
      url: this.songForm.get('url').value,
      // id: this.songForm.get('name').value.replace(' ', '-')
      id: String(Math.floor(Math.random() * 10000))
    };

    this.collection.push(newSong);
    this.storage.saveSongs();
    this.revert();
  }

  buildForm() {
    let combo = Validators.compose([
      Validators.required,
      this.urlValidator
    ]);

    this.songForm = this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', combo]
    });
  }

  revert() {
    this.songForm.setValue({
      name: '',
      url: ''
    });
  }
}
