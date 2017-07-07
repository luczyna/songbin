import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { LocalStorageService } from 'ngx-store';
import { Song } from '../models/song';

describe('StorageService', () => {
  let service: StorageService;
  let importedModule: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StorageService, LocalStorageService, Song]
    });

    service = TestBed.get(StorageService);
    importedModule = TestBed.get(LocalStorageService);
  });

  afterEach(() => {
    importedModule.clear('prefix');
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#getSongs', () => {
    it('should be available', () => {
      expect(service.getSongs).toBeDefined();
    });

    it('should give me an empty array initially', () => {
      importedModule.clear('prefix');
      expect(service.getSongs().length).toBe(0);
    });

    it('should give me some Songs when there are some in localStorage', () => {
      importedModule.set('songs',
        [ {name: 'test', url: 'console.log'} ]
      );

      let result = service.getSongs();
      expect(result.length).toBe(1);
    });
  });

  describe('#saveSongs', () => {
    it('should be available', () => {
      expect(service.saveSongs).toBeDefined();
    });

    it('should save data to localStorage under the key "songs"', () => {
      let test = [ {name: 'test', url: 'fake.url'} ];
      service.saveSongs(test);
      let result = importedModule.get('songs');
      expect(result.length).toBe(test.length);
      expect(result[0].name).toBe(test[0].name);
      expect(result[0].url).toBe(test[0].url);
    });
  });
});
