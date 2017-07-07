import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { WebStorageModule } from 'ngx-store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddSongComponent } from './add-song/add-song.component';

@NgModule({
  declarations: [
    AppComponent,
    AddSongComponent
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
