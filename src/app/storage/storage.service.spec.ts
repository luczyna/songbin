import { TestBed, inject } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { LocalStorageService } from 'ngx-store';
import { Song } from '../models/song';

describe('StorageService', () => {
  let service: StorageService;
  let importedModule: LocalStorageService;
  let testData = [ {name: 'test', url: 'fake.url'} ];

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
      importedModule.set('songs', testData);

      let result = service.getSongs();
      expect(result.length).toBe(1);
    });
  });

  describe('#saveSongs', () => {
    it('should be available', () => {
      expect(service.saveSongs).toBeDefined();
    });

    it('should save data to localStorage under the key "songs"', () => {
      service.saveSongs(testData);
      let result = importedModule.get('songs');

      expect(result.length).toBe(testData.length);
      expect(result[0].name).toBe(testData[0].name);
      expect(result[0].url).toBe(testData[0].url);
    });
  });

  describe('#clearSongs', () => {
    it('should be available', () => {
      expect(service.clearSongs).toBeDefined();
    });

    it('should remove all storage under the name of "songs"', () => {
      service.saveSongs(testData);
      expect(service.getSongs().length).toBe(1);

      service.clearSongs();
      expect(service.getSongs().length).toBe(0);
    });

    it('should not remove any other storage under different keys', () => {
      var goldenKey = 'this should still be here';
      importedModule.set('poop', goldenKey);
      importedModule.set('songs', testData);
      expect(service.getSongs().length).toBe(1);

      service.clearSongs();
      expect(importedModule.get('poop')).toBe(goldenKey);
    });
  });
});
