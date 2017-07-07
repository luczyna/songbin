import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSongComponent } from './add-song/add-song.component';

const routes: Routes = [
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
