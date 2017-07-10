import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSongComponent } from './add-song/add-song.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongDetailComponent } from './song-detail/song-detail.component';

const routes: Routes = [
  {
    path: '',
    component: SongListComponent
  },
  {
    path: 'new',
    component: AddSongComponent,
    children: []
  },
  {
    path: 'song/:id',
    component: SongDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
