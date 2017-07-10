import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { LocalStorageService } from 'ngx-store';

import { SongDetailComponent } from './song-detail.component';
import { MissingSongComponent } from '../missing-song/missing-song.component';
import { StorageService } from '../storage/storage.service';
import { ActivatedRouteStub } from '../../testing/router-stubs';

describe('SongDetailComponent', () => {
  let component: SongDetailComponent;
  let fixture: ComponentFixture<SongDetailComponent>;
  let importedModule = new LocalStorageService();
  let activatedRoute: ActivatedRouteStub;

  let parameters: {
    id: string
  };

  beforeEach(async(() => {
    importedModule.set('songs', [{name: 'test', url: 'test.url', id: 'ABCDE'}]);
    parameters = {id: 'ABCDE'};

    activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(
          [
            {path: 'song/:id', component: SongDetailComponent},
            {path: 'missing-song', component: MissingSongComponent}
          ]
        )
      ],
      declarations: [
        SongDetailComponent,
        MissingSongComponent
      ],
      providers: [
        StorageService,
        LocalStorageService,
        { provide: ActivatedRoute, useValue: activatedRoute },
        ActivatedRouteStub
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    activatedRoute.testParamMap = parameters;
    fixture = TestBed.createComponent(SongDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should be created even with a bad song id', () => {
    activatedRoute.testParamMap = { id: 'missing' };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
