import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSongComponent } from './add-song/add-song.component';
import { SongListComponent } from './song-list/song-list.component';

const routes: Routes = [
  {
    path: '',
    component: SongListComponent
  },
  {
    path: 'new',
    component: AddSongComponent,
    children: []
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
