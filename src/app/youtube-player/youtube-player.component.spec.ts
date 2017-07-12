import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YoutubePlayerModule } from 'ng2-youtube-player';

import { YoutubePlayerComponent } from './youtube-player.component';

describe('YoutubePlayerComponent', () => {
  let component: YoutubePlayerComponent;
  let fixture: ComponentFixture<YoutubePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ YoutubePlayerModule ],
      declarations: [ YoutubePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YoutubePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('#onStateChange', () => {
    it('should be available', () => {
      expect(component.onStateChange).toBeDefined();
    });
  });

  describe('#playSegment', () => {
    beforeEach(() => {
      component.segments = [ [0, 10], [11, 20] ];
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
        component.playSegment(0);

        expect(component.yt.pauseVideo).toHaveBeenCalled();
      });
    });

    describe('when the video is not playing', () => {
      beforeEach(() => {
        spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      });

      it('should not pause the video', () => {
        spyOn(component.yt, 'pauseVideo');
        component.playSegment(0);

        expect(component.yt.pauseVideo).not.toHaveBeenCalled();
      });
    });

    it('should seek to a time in the video', () => {
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment(0);
      expect(component.yt.seekTo).toHaveBeenCalled();
    });

    it('should seek to a time defined by the provided segment', () => {
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment(0);
      expect(component.yt.seekTo).toHaveBeenCalledWith(0, false);
    });

    it('should set `watchForPlaying to true`', () => {
      component.watchForPlaying = false;
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment(0);
      expect(component.watchForPlaying).toBe(true);
    });

    it('should play the video', () => {
      component.watchForPlaying = false;
      spyOn(component.yt, 'getPlayerState').and.returnValue('STOPPED');
      component.playSegment(0);
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

  describe('#stopVideo', () => {
    beforeEach(() => {
      // spy on these to allow tests to call this.player.#method
      spyOn(component.yt, 'stopVideo');
    });

    it('should be available', () => {
      expect(component.stopVideo).toBeDefined();
    });

    it('should set `watchForPlaying` to false', () => {
      component.watchForPlaying = true;
      component.stopVideo();

      expect(component.watchForPlaying).toBe(false);
    });
  });

  describe('#trimIdFromYTURL', () => {
    it('should be available', () => {
      expect(component.trimIdFromYTURL).toBeDefined();
    });

    it('should provide just the id from a browser youtube url', () => {
      component.ytid = 'https://www.youtube.com/watch?v=KI0MHwGzl6U';
      let result = component.trimIdFromYTURL();

      expect(result).toBe('KI0MHwGzl6U');
    });
  });
});
