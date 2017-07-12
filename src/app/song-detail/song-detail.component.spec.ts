import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { LocalStorageService } from 'ngx-store';
import { YoutubePlayerModule } from 'ng2-youtube-player';

import { SongDetailComponent } from './song-detail.component';
import { MissingSongComponent } from '../missing-song/missing-song.component';
import { SegmentsComponent } from '../segments/segments.component';
import { StorageService } from '../storage/storage.service';
import { ConstantService } from '../constant/constant.service';
import { YoutubePlayerComponent } from '../youtube-player/youtube-player.component';
import { ActivatedRouteStub } from '../../testing/router-stubs';

describe('SongDetailComponent', () => {
  let component: SongDetailComponent;
  let fixture: ComponentFixture<SongDetailComponent>;
  let importedModule = new LocalStorageService();
  let activatedRoute: ActivatedRouteStub;

  let parameters: {
    id: string
  };

  let sampleSong = {name: 'test', url: 'test.url', id: 'ABCDE', segments: []};

  beforeEach(() => {
    importedModule.set('songs', [sampleSong]);
    activatedRoute = new ActivatedRouteStub();
  });

  describe('when looking for an existing song', () => {
    beforeEach(async(() => {
      parameters = {id: 'ABCDE'};
      setUpTestBed();

      activatedRoute.testParamMap = parameters;
      fixture = TestBed.createComponent(SongDetailComponent);
      component = fixture.componentInstance;
      spyOn(component, 'setSongDetail').and.callThrough();
      fixture.detectChanges();
    }));

    it('should be created', () => {
      expect(component).toBeTruthy();
    });

    it('should call #setSongDetail', () => {
      fixture.detectChanges();
      expect(component.setSongDetail).toHaveBeenCalled();
    });
  });

  describe('when looking with a bad song id', () => {
    beforeEach(async(() => {
      parameters = {id: 'missing'};
      setUpTestBed();

      activatedRoute.testParamMap = parameters;
      fixture = TestBed.createComponent(SongDetailComponent);
      component = fixture.componentInstance;
      spyOn(component, 'handleSongError').and.callThrough();
      fixture.detectChanges();
    }));

    it('should still be created', () => {
      expect(component).toBeTruthy();
    });

    it('should handle the error', () => {
      fixture.detectChanges();
      expect(component.handleSongError).toHaveBeenCalled();
    });
  });

  describe('#cancelSongEdits', () => {
    beforeEach(async(() => setUpComponent('ABCDE')));

    it('should be available', () => {
      expect(component.cancelSongEdits).toBeDefined();
    });

    it('should disable the name input', () => {
      component.cancelSongEdits();
      expect(component.songForm.get('name').disabled).toBeTruthy();
    });

    it('should disable the url input', () => {
      component.cancelSongEdits();
      expect(component.songForm.get('url').disabled).toBeTruthy();
    });

    it('should reset the name input to what it was originally', () => {
      component.songForm.get('name').setValue('poop');
      component.cancelSongEdits();

      expect(component.songForm.get('name').value).not.toBe('poop');
      expect(component.songForm.get('name').value).toBe(sampleSong.name);
    });

    it('should reset the url input to what it was originally', () => {
      component.songForm.get('url').setValue('poop');
      component.cancelSongEdits();

      expect(component.songForm.get('url').value).not.toBe('poop');
      expect(component.songForm.get('url').value).toBe(sampleSong.url);
    });
  });

  describe('#createSongForm', () => {
    beforeEach(async(() => setUpComponent('ABCDE')));

    it('should be available', () => {
      expect(component.createSongForm).toBeDefined();
    });

    it('should define `songForm` on the component', () => {
      expect(component.songForm).not.toBeUndefined();
    });

    describe('name in the form', () => {
      it('should be available', () => {
        expect(component.songForm.get('name')).not.toBeNull();
      });

      it('should have a default value already', () => {
        expect(component.songForm.get('name').value).toBe(sampleSong.name);
      });

      it('should set the name to be disabled', () => {
        expect(component.songForm.get('name').disabled).toBeTruthy();
      });
    });

    describe('url in the form', () => {
      it('should be available', () => {
        expect(component.songForm.get('url')).not.toBeNull();
      });

      it('should have a default value already', () => {
        expect(component.songForm.get('url').value).toBe(sampleSong.url);
      });

      it('should set the url to be disabled', () => {
        expect(component.songForm.get('url').disabled).toBeTruthy();
      });
    });
  });

  describe('#editSong', () => {
    beforeEach(async(() => setUpComponent('ABCDE')));

    it('should be available', () => {
      expect(component.editSong).toBeDefined();
    });

    it('should enable the name input', () => {
      component.editSong();
      expect(component.songForm.get('name').enabled).toBeTruthy();
    });

    it('should enable the url input', () => {
      component.editSong();
      expect(component.songForm.get('url').enabled).toBeTruthy();
    });
  });

  describe('#handleSongError', () => {
    beforeEach(async(() => setUpComponent('missing')));

    it('should be available', () => {
      expect(component.handleSongError).toBeDefined();
    });

    it('should redirect us', inject([Router], (router: Router) => {
      component.handleSongError('fake error');
      expect(router.url).toBe('/missing-song');
    }));
  });

  describe('#saveSongEdits', () => {
    beforeEach(async(() => setUpComponent('ABCDE')));

    it('should be available', () => {
      expect(component.saveSongEdits).toBeDefined();
    });

    it('should disable the name input', () => {
      component.saveSongEdits();
      expect(component.songForm.get('name').disabled).toBeTruthy();
    });

    it('should disable the url input', () => {
      component.saveSongEdits();
      expect(component.songForm.get('url').disabled).toBeTruthy();
    });

    it('should set `editing` to false', () => {
      component.editing = true;
      component.saveSongEdits();
      expect(component.editing).toBe(false);
    });

    it('update the stored value for the name', () => {
      component.songForm.get('name').setValue('testtest');
      expect(component.song.name).not.toBe('testtest');

      component.saveSongEdits();
      expect(component.song.name).toBe('testtest');
    });

    it('update the stored value for the url', () => {
      component.songForm.get('url').setValue('testtest.test');
      expect(component.song.url).not.toBe('testtest.test');

      component.saveSongEdits();
      expect(component.song.url).toBe('testtest.test');
    });
  });

  describe('#setSongDetail', () => {
    beforeEach(async(() => setUpComponent('ABCDE')));

    it('should be available', () => {
      expect(component.setSongDetail).toBeDefined();
    });

    it('should define the `song`', () => {
      expect(component.song).not.toBeUndefined();
    });

    it('should define the `urlValidator`', () => {
      expect(component.urlValidator).not.toBeUndefined();
    });

    it('should trigger #createSongForm', () => {
      spyOn(component, 'createSongForm');
      component.setSongDetail(sampleSong);

      expect(component.createSongForm).toHaveBeenCalled();
    });
  });

  describe('#toggleEditing', () => {
    beforeEach(async(() => setUpComponent('ABCDE')));

    it('should be available', () => {
      expect(component.toggleEditing).toBeDefined();
    });

    describe('when `editing` is true', () => {
      beforeEach(() => component.editing = true);

      it('should set `editing` to false', () => {
        component.toggleEditing();

        expect(component.editing).toBe(false);
      });

      it('should call #cancelSongEdits', () => {
        spyOn(component, 'cancelSongEdits');
        component.toggleEditing();

        expect(component.cancelSongEdits).toHaveBeenCalled();
      });
    });

    describe('when `editing` is false', () => {
      beforeEach(() => component.editing = false);

      it('should set `editing` to true', () => {
        component.toggleEditing();

        expect(component.editing).toBe(true);
      });

      it('should call #editSong', () => {
        spyOn(component, 'editSong');
        component.toggleEditing();

        expect(component.editSong).toHaveBeenCalled();
      });
    });
  });

  //////

  const setUpTestBed = () => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        YoutubePlayerModule,
        RouterTestingModule.withRoutes(
          [
            {path: 'song/:id', component: SongDetailComponent},
            {path: 'missing-song', component: MissingSongComponent}
          ]
        )
      ],
      declarations: [
        MissingSongComponent,
        SongDetailComponent,
        SegmentsComponent,
        YoutubePlayerComponent
      ],
      providers: [
        ActivatedRouteStub,
        ConstantService,
        LocalStorageService,
        StorageService,
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
    .compileComponents();
  }

  // the simple way of creating the component, without any spies
  const setUpComponent = (parameterValue: string) => {
    parameters = {id: parameterValue};
    setUpTestBed();

    activatedRoute.testParamMap = parameters;
    fixture = TestBed.createComponent(SongDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});
