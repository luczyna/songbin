import { Component } from '@angular/core';

import { StorageService } from './storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ StorageService ]
})
export class AppComponent {
  title = 'app';

  constructor(private storage: StorageService) {}

  public clearSavedSongs(): void {
    this.storage.clearSongs();
    window.alert('all saved songs have been cleared from storage');
  }
}
