import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubePlayerModule } from 'ng2-youtube-player';

import { YoutubePlayerComponent } from './youtube-player.component';
import { Segment } from '../models/segment';
import { PlayerService } from '../player/player.service';

describe('YoutubePlayerComponent', () => {
  let component: YoutubePlayerComponent;
  let fixture: ComponentFixture<YoutubePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ YoutubePlayerModule ],
      declarations: [ YoutubePlayerComponent ],
      providers: [ PlayerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubePlayerComponent);
    component = fixture.componentInstance;
    component.ytid = 'TESTTESTTEST';
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('#onStateChange', () => {
    beforeEach(() => {
      spyOn(component, 'describeEvent');
    });

    it('should be available', () => {
      expect(component.onStateChange).toBeDefined();
    });

    describe('when the video is paused', () => {
      it('should restart the segment if it loops', () => {
        spyOn(component, 'playSegment');

        component.segment = new Segment('test segment', 1, 0, 10);
        component.isLooping = true;
        component.onStateChange({data: 2});

        expect(component.playSegment).toHaveBeenCalled();
      });

      it('should reset watchForPlaying (to false) if the segment does not loop', () => {
        component.watchForPlaying = true;
        component.segment = new Segment('test segment', 1, 0, 10);
        component.isLooping = false;
        component.onStateChange({data: 2});

        expect(component.watchForPlaying).toBe(false);
      });
    });

    describe('when the video is playing', () => {
      it('should set up the end of the segment', () => {
        spyOn(component, 'setUpSegmentEnd');

        component.segment = new Segment('test segment', 1, 0, 10);
        component.onStateChange({data: 1});

        expect(component.setUpSegmentEnd).toHaveBeenCalled();
      });
    });
  });

  describe('#playSegment', () => {
    beforeEach(() => {
      component.segment = new Segment('test segment', 1, 0, 2);
      // spy on these to allow tests to call this.player.#method
      spyOn(component.yt, 'seekTo');
      spyOn(component.yt, 'playVideo');
    });

    it('should be available', () => {
      expect(component.playSegment).toBeDefined();
    });

    describe('when the video is playing', () => {
      beforeEach(() => {
        spyOn(component.yt, 'getPlayerState').and.returnValue('PLAYING');
      });

      it('should pause the video', () => {
        spyOn(component.yt, 'pauseVideo');
        component.playSegment();

        expect(component.yt.pauseVideo).toHaveBeenCalled();
      });
    });

    describe('when the video is not playing', () => {
      beforeEach(() => {
        spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      });

      it('should not pause the video', () => {
        spyOn(component.yt, 'pauseVideo');
        component.playSegment();

        expect(component.yt.pauseVideo).not.toHaveBeenCalled();
      });
    });

    it('should seek to a time in the video', () => {
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment();
      expect(component.yt.seekTo).toHaveBeenCalled();
    });

    it('should seek to a time defined by the provided segment', () => {
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment();
      expect(component.yt.seekTo).toHaveBeenCalledWith(0, true);
    });

    it('should set `watchForPlaying to true`', () => {
      component.watchForPlaying = false;
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment();
      expect(component.watchForPlaying).toBe(true);
    });

    it('should play the video', () => {
      component.watchForPlaying = false;
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment();
      expect(component.yt.playVideo).toHaveBeenCalled();
    });
  });

  describe('#savePlayer', () => {
    it('should be available', () => {
      expect(component.savePlayer).toBeDefined();
    });
  });

  describe('#setUpVideoInformation', () => {
    beforeEach(() => {
      // spy on these to allow tests to call this.player.#method
      spyOn(component.yt, 'getDuration').and.returnValue(20);
    });

    it('should be available', () => {
      expect(component.setUpVideoInformation).toBeDefined();
    });

    it('should define `duration`', () => {
      component.setUpVideoInformation();

      expect(component.duration).toBeDefined();
    });
  });

  describe('#setUpSegmentEnd', () => {
    beforeEach(() => {
      // spy on these to allow tests to call this.player.#method
      spyOn(component.yt, 'getCurrentTime');
    });

    it('should be available', () => {
      expect(component.setUpSegmentEnd).toBeDefined();
    });

    it('should start a timeout', () => {
      component.timeout = null;
      component.segment = new Segment('test segment', 1, 0, 10);
      component.setUpSegmentEnd();

      expect(component.timeout).not.toBeNull();
    });
  });

  describe('#stopVideo', () => {
    beforeEach(() => {
      // spy on these to allow tests to call this.player.#method
      spyOn(component.yt, 'pauseVideo');
    });

    it('should be available', () => {
      expect(component.stopVideo).toBeDefined();
    });

    it('should pause the video', () => {
      component.stopVideo();
      expect(component.yt.pauseVideo).toHaveBeenCalled();
    });

    it('clear a timeout if one exists', () => {
      component.timeout = 123456;
      component.stopVideo();

      expect(component.timeout).toBe(null);
    });
  });
});
