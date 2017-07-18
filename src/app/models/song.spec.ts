import { Song } from '../models/song';

let song: Song;

describe('Song Model', () => {
  describe('attributes', () => {
    beforeEach(makeSong);

    it('should have a `name` attribute', () => {
      expect(song.name).toBeDefined();
    });

    it('should have a `url` attribute', () => {
      expect(song.url).toBeDefined();
    });

    it('should have a `id` attribute', () => {
      expect(song.id).toBeDefined();
    });

    it('should have a `segments` attribute', () => {
      expect(song.segments).toBeDefined();
    });
  });

  describe('#getYTId', () => {
    it('should be available', () => {
      makeSong();
      expect(song.getYTId).toBeDefined();
    });

    describe('differnt youtube url sources', () => {
      let browserUrls = [
        {
          link: 'https://www.youtube.com/watch?v=_PzuzS1Zafo',
          id: '_PzuzS1Zafo'
        },
        {
          link: 'https://www.youtube.com/watch?v=7Iweue-OcMo',
          id: '7Iweue-OcMo'
        },
        {
          link: 'http://www.youtube.com/watch?v=7LEmer7wwHI',
          id: '7LEmer7wwHI'
        },
        {
          link: 'http://www.youtube.com/watch?v=4he2h5o3WQs',
          id: '4he2h5o3WQs'
        }
      ];

      let shareUrls = [
        {
          link: 'https://youtu.be/4he2h5o3WQs',
          id: '4he2h5o3WQs'
        },
        {
          link: 'http://youtu.be/4he2h5o3WQs?t=1s',
          id: '4he2h5o3WQs'
        },
        {
          link: 'http://youtu.be/BCRcgt04geA',
          id: 'BCRcgt04geA'
        },
        {
          link: 'https://youtu.be/BCRcgt04geA?t=20',
          id: 'BCRcgt04geA'
        }
      ];

      it('should give us the ID from a browser URL', () => {
        browserUrls.forEach((url) => {
          song = new Song('test', url.link, 'test');
          expect(song.getYTId()).toBe(url.id);
        });
      });

      it('should give us the ID from a share URL', () => {
        shareUrls.forEach((url) => {
          song = new Song('test', url.link, 'test');
          expect(song.getYTId()).toBe(url.id);
        });
      });
    });
  });
});

//////

function makeSong() {
  song = new Song('test', 'fake.url', 'ABCDE');
}
