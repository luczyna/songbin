import { Song } from './song';
import { Segment } from './segment';

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

  describe('#makeNewSegmentId', () => {
    it('should be available', () => {
      makeSong();
      expect(song.makeNewSegmentId).toBeDefined();
    });

    it('should give us an initial id when there are no segments', () => {
      makeSong();
      expect(song.makeNewSegmentId()).toBe(1);
    });

    it('should give us 2 when there is 1 segment', () => {
      let segment: Segment;
      makeSong();

      segment = new Segment('test', song.makeNewSegmentId(), 0, 2);
      song.segments.push(segment);

      expect(song.makeNewSegmentId()).toBe(2);
    });

    it('should give us a unique id when we delete the last segment', () => {
      let segment: Segment;
      let uniqueId: number;
      let allAreUnique: boolean = true;
      makeSong();

      segment = new Segment('test', song.makeNewSegmentId(), 0, 2);
      song.segments.push(segment);

      segment = new Segment('test 2', song.makeNewSegmentId(), 0, 4);
      song.segments.push(segment);

      segment = new Segment('test 3', song.makeNewSegmentId(), 0, 6);
      song.segments.push(segment);

      song.segments.pop();
      uniqueId = song.makeNewSegmentId();

      song.segments.forEach((seg) => {
        if (seg.id === uniqueId) allAreUnique = false;
      });

      expect(allAreUnique).toBe(true);
    });

    it('should give us a unique id when we delete any segment', () => {
      let segment: Segment;
      let uniqueId: number;
      let allAreUnique: boolean = true;
      makeSong();

      segment = new Segment('test', song.makeNewSegmentId(), 0, 2);
      song.segments.push(segment);

      segment = new Segment('test 2', song.makeNewSegmentId(), 0, 4);
      song.segments.push(segment);

      segment = new Segment('test 3', song.makeNewSegmentId(), 0, 6);
      song.segments.push(segment);

      song.segments.splice(1, 1);
      uniqueId = song.makeNewSegmentId();

      song.segments.forEach((seg) => {
        if (seg.id === uniqueId) allAreUnique = false;
      });

      expect(allAreUnique).toBe(true);
    })
  });
});

//////

function makeSong() {
  song = new Song('test', 'fake.url', 'ABCDE');
}
