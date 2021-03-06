import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { WebStorageModule } from 'ngx-store';
import { YoutubePlayerModule } from 'ng2-youtube-player';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddSongComponent } from './add-song/add-song.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongDetailComponent } from './song-detail/song-detail.component';
import { MissingSongComponent } from './missing-song/missing-song.component';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { SegmentsComponent } from './segments/segments.component';
import { SegmentComponent } from './segment/segment.component';
import { UnknownPageComponent } from './unknown-page/unknown-page.component';

@NgModule({
  declarations: [
    AppComponent,
    AddSongComponent,
    SongListComponent,
    SongDetailComponent,
    MissingSongComponent,
    YoutubePlayerComponent,
    SegmentsComponent,
    SegmentComponent,
    UnknownPageComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    WebStorageModule,
    YoutubePlayerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
