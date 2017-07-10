import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSongComponent } from './add-song/add-song.component';
import { SongListComponent } from './song-list/song-list.component';
import { SongDetailComponent } from './song-detail/song-detail.component';
import { MissingSongComponent } from './missing-song/missing-song.component';

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
  },
  {
    path: 'missing-song',
    component: MissingSongComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
