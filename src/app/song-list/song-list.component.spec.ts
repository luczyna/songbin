import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SongListComponent } from './song-list.component';
import { RouterLinkStubDirective } from '../../testing/router-stubs';
import { StorageService } from '../storage/storage.service';
import { LocalStorageService } from 'ngx-store';

describe('SongListComponent', () => {
  let component: SongListComponent;
  let fixture: ComponentFixture<SongListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SongListComponent, RouterLinkStubDirective ],
      providers: [ StorageService, LocalStorageService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SongListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
