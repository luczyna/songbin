import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AddSongComponent } from './add-song.component';
import { ConstantService } from '../constant/constant.service';
import { LocalStorageService } from 'ngx-store';
import { StorageService } from '../storage/storage.service';

describe('AddSongComponent', () => {
  let component: AddSongComponent;
  let fixture: ComponentFixture<AddSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ ReactiveFormsModule, FormsModule ],
      declarations: [ AddSongComponent ],
      providers: [ StorageService, LocalStorageService, ConstantService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    let importedStorage = new LocalStorageService();
    importedStorage.clear();

    fixture = TestBed.createComponent(AddSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('#addingSong', () => {
    it('should be available', () => {
      expect(component.addingSong).toBeDefined();
    });

    it('should add a song to the song collection', () => {
      expect(component.collection.length).toBe(0);

      component.songForm.get('name').setValue('fake song');
      component.songForm.get('url').setValue('fake.song');
      component.addingSong();

      expect(component.collection.length).toBe(1);
    });

    it('should make the new song reflect what was provided in the form', () => {
      expect(component.collection.length).toBe(0);

      component.songForm.get('name').setValue('fake song');
      component.songForm.get('url').setValue('fake.song');
      component.addingSong();

      expect(component.collection[0].name).toBe('fake song');
      expect(component.collection[0].url).toBe('fake.song');
    });

    it('should revert the form', () => {
      spyOn(component, 'revert');
      component.songForm.get('name').setValue('fake song');
      component.songForm.get('url').setValue('fake.song');
      component.addingSong();

      expect(component.revert).toHaveBeenCalled();
    })
  });

  describe('#buildForm', () => {
    it('should be available', () => {
      expect(component.buildForm).toBeDefined();
    });

    it('should define the `songForm`', () => {
      component.buildForm();
      expect(component.songForm).toBeDefined();
    });
  });

  describe('#onValueChange', () => {
    it('should be available', () => {
      expect(component.onValueChange).toBeDefined();
    });

    describe('when the url input has been altered', () => {
      it('should add a message to the url error when it is not valid', () => {
        let control = component.songForm.get('url');
        control.setValue('not a url');
        control.markAsDirty();

        component.onValueChange({});

        expect(component.formErrors.url.length).toBeTruthy();
      });

      it('should not add a message to the url error when it is valid', () => {
        let control = component.songForm.get('url');
        control.setValue('youtube.com');
        control.markAsDirty();

        component.onValueChange({});

        expect(component.formErrors.url.length).toBeFalsy();
      });
    });

    describe('when the url input has not been altered', () => {
      it('should not add a message to the url error when it is valid', () => {
        component.onValueChange({});

        expect(component.formErrors.url.length).toBeFalsy();
      });
    });
  });

  describe('#revert', () => {
    it('should be available', () => {
      expect(component.revert).toBeDefined();
    });

    it('should set the forms\' name to an empty string', () => {
      component.songForm.get('name').setValue('poop');
      component.revert();

      expect(component.songForm.get('name').value).toBe('');
    });

    it('should set the forms\' url to an empty string', () => {
      component.songForm.get('url').setValue('poop');
      component.revert();

      expect(component.songForm.get('url').value).toBe('');
    });

    it('should set `showUrlErrors` to false', () => {
      component.showUrlErrors = true;
      component.revert();

      expect(component.showUrlErrors).toBe(false);
    });
  });

  describe('#updateUrlErrorVisibility', () => {
    it('should be available', () => {
      expect(component.updateUrlErrorVisibility).toBeDefined();
    });

    it('should update `showUrlErrors`', () => {
      component.showUrlErrors = false;
      component.updateUrlErrorVisibility(true);

      expect(component.showUrlErrors).toBe(true);

      component.showUrlErrors = true;
      component.updateUrlErrorVisibility(false);

      expect(component.showUrlErrors).toBe(false);
    })
  });
});
