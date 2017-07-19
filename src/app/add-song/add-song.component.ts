import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,
         Validators, ValidatorFn } from '@angular/forms';
import { trigger, state, style,
         animate, transition } from '@angular/animations';

import { Song } from '../models/song';
import { StorageService } from '../storage/storage.service';
import { ConstantService } from '../constant/constant.service';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss'],
  animations: [ getUrlErrorAnimations() ]
})

export class AddSongComponent implements OnInit {
  collection: Array<Song>;
  songForm: FormGroup;

  urlValidator: ValidatorFn;
  formErrors = {
    name: '',
    url: ''
  };
  showUrlErrors: boolean = false;

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
    let name: string = this.songForm.get('name').value;
    let url: string = this.songForm.get('url').value;
    let id: string = String(Math.floor(Math.random() * 10000));

    const newSong: Song = new Song(name, url, id);

    this.collection.push(newSong);
    this.storage.saveSongs();
    this.revert();
  }

  buildForm() {
    this.songForm = this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', this.urlValidator]
    });

    this.songForm.valueChanges.subscribe(data => this.onValueChange(data));
  }

  onValueChange(data?: any) {
    if (!this.songForm) return;

    // TODO looking only at the url... look at the name later
    let control = this.songForm.get('url');
    this.formErrors.url = '';

    if (control.dirty && !control.valid) {
      if (!control.value.length) this.formErrors.url += 'The URL is required. ';
      this.formErrors.url += 'Please provide a valid URL.';
    }
  }

  revert() {
    this.songForm.setValue({
      name: '',
      url: ''
    });

    this.showUrlErrors = false;
  }

  updateUrlErrorVisibility(toWhat: boolean) {
    this.showUrlErrors = toWhat;
  }
}

function getUrlErrorAnimations() {
  // https://angular.io/guide/animations#example-entering-and-leaving
  return trigger('sliding', [
    state('in', style({transform: 'translateX(0)'})),
    transition(':enter', [
      style({transform: 'translateX(-100%)'}),
      animate(150)
    ]),
    transition(':leave', [
      animate(150, style({transform: 'translateX(100%)'}))
    ])
  ])
}
