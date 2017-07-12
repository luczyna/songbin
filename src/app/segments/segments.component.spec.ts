import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';

import { LocalStorageService } from 'ngx-store';

import { Song } from '../models/song';
import { SegmentsComponent } from './segments.component';
import { StorageService } from '../storage/storage.service';

describe('SegmentsComponent', () => {
  let component: SegmentsComponent;
  let fixture: ComponentFixture<SegmentsComponent>;
  let testSong: Song;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ SegmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentsComponent);
    component = fixture.componentInstance;

    testSong = new Song('fancy test', 'test.url', 'ABCDE');
    component.song = testSong;

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('#applyValidatorsToTimes', () => {
    it('should be available', () => {
      expect(component.applyValidatorsToTimes).toBeDefined();
    });

    describe('when the inputs both have value', () => {
      it('should be valid when the start is less than the end', () => {
        component.segmentForm.get('start').setValue(1);
        component.segmentForm.get('end').setValue(2);

        expect(component.segmentForm.get('start').valid).toBe(true);
        expect(component.segmentForm.get('end').valid).toBe(true);
      });

      it('should be invalid when the start is greater than the end', () => {
        component.segmentForm.get('start').setValue(3);
        component.segmentForm.get('end').setValue(2);

        expect(component.segmentForm.valid).toBe(false);
      });

      it('should be invalid when the start is equal to the end', () => {
        component.segmentForm.get('start').setValue(2);
        component.segmentForm.get('end').setValue(2);

        expect(component.segmentForm.valid).toBe(false);
      });
    });

    describe('when one or no inputs have value', () => {
      it('should be invalid when the start is empty', () => {
        component.segmentForm.get('start').setValue(null);
        component.segmentForm.get('end').setValue(2);

        expect(component.segmentForm.valid).toBe(false);
      });

      it('should be invalid when the end is empty', () => {
        component.segmentForm.get('start').setValue(2);
        component.segmentForm.get('end').setValue(null);

        expect(component.segmentForm.valid).toBe(false);
      });

      it('should be invalid when both start and end are empty', () => {
        component.segmentForm.get('start').setValue(null);
        component.segmentForm.get('end').setValue(null);

        expect(component.segmentForm.valid).toBe(false);
      });
    });
  });

  describe('#buildForm', () => {
    it('should be available', () => {
      expect(component.buildForm).toBeDefined();
    });

    it('should define `segmentForm`', () => {
      component.buildForm();

      expect(component.segmentForm).toBeDefined();
    });

    it('should initialise certain form validations', () => {
      spyOn(component, 'applyValidatorsToTimes');
      component.buildForm();

      expect(component.applyValidatorsToTimes).toHaveBeenCalled();
    });
  });

  describe('`segmentForm`', () => {
    beforeEach(() => component.buildForm());

    it('should have `name`', () => {
      expect(component.segmentForm.get('name')).not.toBeNull();
    });

    it('should make `name` required', () => {
      expect(component.segmentForm.get('name').validator).toBe(Validators.required);
    });

    it('should have `start`', () => {
      expect(component.segmentForm.get('start')).not.toBeNull();
    });

    it('should have `end`', () => {
      expect(component.segmentForm.get('end')).not.toBeNull();
    });
  });

  describe('#saveSegment', () => {
    let storage;
    let localStorage;

    beforeEach(() => {
      localStorage = new LocalStorageService();
      localStorage.set('songs', [testSong]);

      storage = new StorageService(localStorage);

      component.buildForm();
      component.segmentForm.get('name').setValue('test');
      component.segmentForm.get('start').setValue(1);
      component.segmentForm.get('end').setValue(2);
      fixture.detectChanges();
    });

    it('should be available', () => {
      expect(component.saveSegment).toBeDefined();
    });

    it('should save a segment to the current song', async((done: DoneFn) => {
      let song = storage.getSongs();
      let segmentCount = song[0].segments.length;
      let updatedSegmentCount;

      component.saveSegment();
      component.onUpdate.subscribe(event => {
        updatedSegmentCount = localStorage.get('songs')[0].segments.length;

        expect(updatedSegmentCount).toBe(segmentCount + 1);
        done();
      });
    }));

    it('should take the segment details from the form', async((done: DoneFn) => {
      component.saveSegment();
      component.onUpdate.subscribe(event => {
        let updatedSegment = storage.getSongs()[0];

        expect(updatedSegment.name).toBe('test');
        expect(updatedSegment.start).toBe(1);
        expect(updatedSegment.end).toBe(2);
        done();
      });
    }));

    it('should default the segment loop attribute to false', async((done: DoneFn) => {
      component.saveSegment();
      component.onUpdate.subscribe(event => {
        let updatedSegment = storage.getSongs()[0];

        expect(updatedSegment.loop).toBe(false);
        done();
      });
    }));

    it('should default the segment playing attribute to false', async((done: DoneFn) => {
      component.saveSegment();
      component.onUpdate.subscribe(event => {
        let updatedSegment = storage.getSongs()[0];

        expect(updatedSegment.playing).toBe(false);
        done();
      });
    }));

    it('should hide the form', () => {
      component.showForm = true;
      component.buildForm();
      component.saveSegment();

      expect(component.showForm).toBe(false);
    });
  });

  describe('#toggleSegmentForm', () => {
    it('should be available', () => {
      expect(component.toggleSegmentForm).toBeDefined();
    });

    describe('when `showForm` is true', () => {
      it('should turn `showForm` to false', () => {
        component.showForm = true;
        component.toggleSegmentForm();

        expect(component.showForm).toBe(false);
      });
    });

    describe('when `showForm` is false', () => {
      beforeEach(() => component.showForm = false);

      it('should turn `showForm` to true', () => {
        component.toggleSegmentForm();

        expect(component.showForm).toBe(true);
      });

      it('should rebuild the form', () => {
        spyOn(component, 'buildForm');
        component.toggleSegmentForm();

        expect(component.buildForm).toHaveBeenCalled();
      });
    });
  });
});
