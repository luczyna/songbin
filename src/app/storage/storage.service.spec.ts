import { StorageService } from './storage.service';
import { LocalStorageService } from 'ngx-store';
import { Song } from '../models/song';

describe('StorageService', () => {
  let service: StorageService;
  let importedModule: LocalStorageService;
  let testData = [ new Song('test', 'fake.url', 'ABCDE') ];

  beforeEach(() => {
    importedModule = new LocalStorageService();
    service = new StorageService(importedModule);
  });

  afterEach(() => {
    importedModule.clear('prefix');
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setting up the collection of songs', () => {
    it('should have no songs if the localStorage key is not set', () => {
      expect(service.collection.songs.length).toBe(0);
    });

    it('should have no songs if the localStorage value is empty', () => {
      importedModule.set('songs', '');
      service = new StorageService(importedModule);

      expect(service.collection.songs.length).toBe(0);
    });

    it('should have no songs if the localStorage value is not an array', () => {
      importedModule.set('songs', '  sdfsdf ');
      service = new StorageService(importedModule);

      expect(service.collection.songs.length).toBe(0);
    });

    it('should have no songs if the localStorage value is not properly foramtted', () => {
      importedModule.set('songs', [
        '  sdfsdf ',
        { something: 'is not', right: true }
      ]);
      service = new StorageService(importedModule);

      expect(service.collection.songs.length).toBe(0);
    });

    it('should have songs if the localStorage value is set with good data', () => {
      createMockData();
      expect(service.collection.songs.length).toBe(testData.length);
    });
  });

  describe('#getSongs', () => {
    it('should be available', () => {
      expect(service.getSongs).toBeDefined();
    });

    it('should give me an empty array initially', () => {
      importedModule.clear('prefix');
      expect(service.getSongs().length).toBe(0);
    });

    describe('when there are already songs in localStorage', () => {
      beforeEach(createMockData);

      it('should give me some Songs', () => {
        let result = service.getSongs();
        expect(result.length).toBe(1);
      });
    });
  });

  describe('#getSong', () => {
    beforeEach(createMockData);

    it('should be available', () => {
      expect(service.getSong).toBeDefined();
    });

    describe('when looking for a song that exists', () => {
      it('should return a Song', (done: any) => {
        service.getSong('ABCDE').then((result) => {
          expect(result.id).toBe(testData[0].id);
          expect(result.name).toBe(testData[0].name);
          expect(result.url).toBe(testData[0].url);
          expect(result.segments.length).toBe(testData[0].segments.length);
          done();
        });
      });
    });

    describe('when looking for a song that does not exists', () => {
      it('should return nothing', (done: any) => {
        service.getSong('missing').then((result) => {
          // THIS SHOULD NOT BE CALLED, IF IT IS
          // THEN THIS TEST WILL FAIL
          expect(result).toBeDefined();
          done();
        }, (error) => {
          expect(error).toBeDefined();
          done();
        });
      });
    });
  });

  describe('#saveSongs', () => {
    it('should be available', () => {
      expect(service.saveSongs).toBeDefined();
    });

    it('should save data to localStorage under the key "songs"', () => {
      service.collection = {
        songs: testData
      };

      service.saveSongs();
      let result = importedModule.get('songs');

      expect(result.length).toBe(testData.length);
      expect(result[0].name).toBe(testData[0].name);
      expect(result[0].url).toBe(testData[0].url);
      expect(result[0].segments.length).toBe(testData[0].segments.length);
    });
  });

  describe('#clearSongs', () => {
    beforeEach(createMockData);

    it('should be available', () => {
      expect(service.clearSongs).toBeDefined();
    });

    it('should remove all storage under the name of "songs"', () => {
      expect(service.getSongs().length).toBe(1);

      service.clearSongs();
      expect(service.getSongs().length).toBe(0);
    });

    it('should not remove any other storage under different keys', () => {
      let goldenKey = 'this should still be here';
      importedModule.set('poop', goldenKey);
      expect(service.getSongs().length).toBe(1);

      service.clearSongs();
      expect(importedModule.get('poop')).toBe(goldenKey);
    });
  });

  //////

  function createMockData(): void {
    importedModule.set('songs', testData);
    service = new StorageService(importedModule);
  }
});
