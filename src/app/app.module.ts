import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { WebStorageModule } from 'ngx-store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddSongComponent } from './add-song/add-song.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongDetailComponent } from './song-detail/song-detail.component';
import { MissingSongComponent } from './missing-song/missing-song.component';

@NgModule({
  declarations: [
    AppComponent,
    AddSongComponent,
    SongListComponent,
    SongDetailComponent,
    MissingSongComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    WebStorageModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
