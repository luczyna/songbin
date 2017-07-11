import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import { Song } from '../models/song';
import { StorageService } from '../storage/storage.service';
import { ConstantService } from '../constant/constant.service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss']
})

export class AddSongComponent implements OnInit {
  collection: Array<Song>;
  songForm: FormGroup;
  urlValidator: ValidatorFn;

  constructor(
    private constant: ConstantService,
    private formBuilder: FormBuilder,
    private storage: StorageService
  ) {
    this.urlValidator = this.constant.getUrlValidator();
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
    this.songForm = this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', this.urlValidator]
    });
  }

  revert() {
    this.songForm.setValue({
      name: '',
      url: ''
    });
  }
}
