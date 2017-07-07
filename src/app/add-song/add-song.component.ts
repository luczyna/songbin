import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Song } from '../models/song';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})

export class AddSongComponent implements OnInit {
  songForm: FormGroup;

  // https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
  urlRegex: RegExp = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
  urlValidator = Validators.pattern(this.urlRegex);

  constructor(private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit() {
  }

  addingSong() {
    const newSong: Song = {
      // omg wut
      // name: this.songForm.value.name as string,
      // url: this.songForm.value.url as string
      name: this.songForm.get('name').value,
      url: this.songForm.get('url').value
    };
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
}
