import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';

import 'rxjs/add/operator/switchMap';

import { Song } from '../models/song';
import { StorageService } from '../storage/storage.service';
import { ConstantService } from '../constant/constant.service';
import { PlayerService } from '../player/player.service';

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.component.html',
  styleUrls: ['./song-detail.component.scss'],
  providers: [ PlayerService ]
})
export class SongDetailComponent implements OnInit {
  song: Song;
  songForm: FormGroup;
  urlValidator: ValidatorFn;

  editing: boolean = false;
  formErrors = {
    name: '',
    url: ''
  };
  showUrlErrors: boolean = false;

  constructor(
    private constant: ConstantService,
    private formBuilder: FormBuilder,
    private player: PlayerService,
    private route: ActivatedRoute,
    private router: Router,
    private storage: StorageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap
      .switchMap((params: ParamMap) => {
        return this.storage.getSong(params.get('id'));
      }).subscribe((song) => this.setSongDetail(song),
                   (error) => this.handleSongError(error));
  }

  public cancelSongEdits() {
    this.songForm.get('name').disable();
    this.songForm.get('url').disable();

    this.songForm.get('name').setValue(this.song.name);
    this.songForm.get('url').setValue(this.song.url);
  }

  public createSongForm(): void {
    this.songForm = this.formBuilder.group({
      name: [{value: this.song.name, disabled: true}, Validators.required],
      url: [{value: this.song.url, disabled: true}, this.urlValidator]
    });

    this.songForm.valueChanges.subscribe(data => this.songFormChange(data));
  }

  public editSong() {
    this.songForm.get('name').enable();
    this.songForm.get('url').enable();
  }

  public handleSongError(error: string): void {
    this.router.navigate(['/missing-song']);
  }

  public saveSongEdits() {
    this.songForm.get('name').disable();
    this.songForm.get('url').disable();
    this.editing = false;

    this.song.name = this.songForm.get('name').value;
    this.song.url = this.songForm.get('url').value;
    this.storage.saveSongs();
  }

  public setSongDetail(song: Song): void {
    this.song = song;
    this.urlValidator = this.constant.getUrlValidator();
    this.createSongForm();
  }

  public songFormChange(data: any): void {
    if (!this.songForm) return;

    // TODO how to simplify this between here and AddSongComponent?
    // TODO looking only at the url... look at the name later
    let control = this.songForm.get('url');
    this.formErrors.url = '';

    if (control.dirty && !control.valid) {
      if (!control.value.length) this.formErrors.url += 'The URL is required. ';
      this.formErrors.url += 'Please provide a valid URL.';
    }
  }

  public toggleEditing(): void {
    this.editing = !this.editing;

    if (this.editing) {
      this.editSong();
    } else {
      this.cancelSongEdits();
    }
  }

  public updateSong(): void {
    this.storage.saveSongs();
  }

  public updateUrlErrorVisibility(showErrors: boolean): void {
    this.showUrlErrors = showErrors;
  }
}
