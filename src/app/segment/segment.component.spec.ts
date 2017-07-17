import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Segment } from '../models/segment';
import { SegmentComponent } from './segment.component';
import { PlayerService } from '../player/player.service';

describe('SegmentComponent', () => {
  let component: SegmentComponent;
  let fixture: ComponentFixture<SegmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SegmentComponent ],
      providers: [ PlayerService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SegmentComponent);
    component = fixture.componentInstance;
    component.segment = new Segment('test segment', 1, 2);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('attributes', () => {
    describe('`isActiveSegment`', () => {
      it('should be defined', () => {
        expect(component.isActiveSegment).toBeDefined();
      });

      it('should default to be false', () => {
        expect(component.isActiveSegment).toBe(false);
      });

      it('should be false when this is not the active Segment', () => {
        let rivalSegment = new Segment('another one!', 0, 0);
        component.player.setActiveSegment(rivalSegment);

        expect(component.isActiveSegment).toBe(false);
      });

      it('should be false when there is no active Segment', () => {
        component.player.removeActiveSegment();
        expect(component.isActiveSegment).toBe(false);
      });

      it('should be true when this is the active Segment', () => {
        component.player.setActiveSegment(component.segment);
        expect(component.isActiveSegment).toBe(true);
      });
    });

    describe('`activeSegmentIsLooping`', () => {
      it('should be available', () => {
        expect(component.activeSegmentIsLooping).toBeDefined();
      });

      it('should update when notified about the active segment updates its own looping setting', () => {
        component.player.updateLooping(true);
        expect(component.activeSegmentIsLooping).toBe(true);
      })
    });

    describe('`disableInteractions`', () => {
      it('should be available', () => {
        expect(component.disableInteractions).toBeDefined();
      });

      it('should default to false (do not disable interactions)', () => {
        expect(component.disableInteractions).toBe(false);
      })

      describe('should be false (do not disable interactions)', () => {
        beforeEach(() => {
          component.disableInteractions = true;
        });

        it('when the youtube player is paused AND the active segment is NOT looping', () => {
          component.activeSegmentIsLooping = false;
          component.player.updatePlayerStatus('PAUSED');

          expect(component.disableInteractions).toBe(false);
        });

        it('when there is not an active segment', () => {
          component.player.removeActiveSegment();
          expect(component.disableInteractions).toBe(false);
        });

        it('when there is a new active segment (a segment is playing), and this segment IS it', () => {
          component.player.setActiveSegment(component.segment);

          expect(component.disableInteractions).toBe(false);
        });
      });

      describe('should be true (please disable)', () => {
        it('when there is a new active segment (a segment is playing), and this segment is not it', () => {
          let rivalSegment = new Segment('another one!', 0, 0);
          component.player.setActiveSegment(rivalSegment);

          expect(component.disableInteractions).toBe(true);
        });
      });
    });

  });

  describe('#deleteSegment', () => {
    it('should be available', () => {
      expect(component.deleteSegment).toBeDefined();
    });
  });

  describe('#editSegment', () => {
    it('should be available', () => {
      expect(component.editSegment).toBeDefined();
    });
  });

  describe('#playSegment', () => {
    it('should be available', () => {
      expect(component.playSegment).toBeDefined();
    });

    describe('when the segment is playing', () => {
      beforeEach(() => {
        component.segment.playing = true;
      });

      it('should pause the segment', () => {
        component.playSegment();
        expect(component.segment.playing).toBe(false);
      });

      it('should notify that there are no actively playing segments', () => {
        spyOn(component.player, 'removeActiveSegment').and.callThrough();
        component.playSegment();

        expect(component.player.removeActiveSegment).toHaveBeenCalled();
      });
    });

    describe('when the segment is not playing', () => {
      beforeEach(() => {
        component.segment.playing = false;
      });

      it('should play the segment', () => {
        component.playSegment();
        expect(component.segment.playing).toBe(true);
      });

      it('should notify that there is a playing segment', () => {
        spyOn(component.player, 'setActiveSegment').and.callThrough();
        component.playSegment();

        expect(component.player.setActiveSegment).toHaveBeenCalled();
      });

      it('should notify the segment looping state', () => {
        spyOn(component.player, 'updateLooping').and.callThrough();
        component.playSegment();

        expect(component.player.updateLooping).toHaveBeenCalled();
      });

      it('should notify the segment looping state value', () => {
        component.segment.loop = false;
        spyOn(component.player, 'updateLooping').and.callThrough();
        component.playSegment();

        expect(component.player.updateLooping).toHaveBeenCalledWith(false);

        component.segment.loop = true;
        component.segment.playing = false;
        component.playSegment();

        expect(component.player.updateLooping).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('#toggleLooping', () => {
    it('should be available', () => {
      expect(component.toggleLooping).toBeDefined();
    });

    describe('when the segment is set to loop', () => {
      beforeEach(() => {
        component.segment.loop = true;
      });

      it('should set the segment to not loop', () => {
        component.toggleLooping();
        expect(component.segment.loop).toBe(false);
      });
    });

    describe('when the segment is not set to loop', () => {
      beforeEach(() => {
        component.segment.loop = false;
      });

      it('should set the segment to loop', () => {
        component.toggleLooping();
        expect(component.segment.loop).toBe(true);
      });
    });

    describe('notifying on loop updates', () => {
      beforeEach(() => {
        spyOn(component.player, 'updateLooping').and.callThrough()
      });

      it('should happen when the segment is playing and is the active one', () => {
        component.segment.playing = true;
        component.isActiveSegment = true;
        component.toggleLooping();

        expect(component.player.updateLooping).toHaveBeenCalled();
      });

      it('should send out the segment\'s current loop value', () => {
        component.segment.playing = true;
        component.isActiveSegment = true;
        component.segment.loop = true;
        component.toggleLooping();
        // toggle looping turns component.segment.loop to false now

        expect(component.player.updateLooping).toHaveBeenCalledWith(false);

        component.toggleLooping();
        // toggle looping turns component.segment.loop back to true
        expect(component.player.updateLooping).toHaveBeenCalledWith(true);
      });

      it('should not happen when the segment is paused', () => {
        component.segment.playing = false;
        component.isActiveSegment = true;
        component.toggleLooping();

        expect(component.player.updateLooping).not.toHaveBeenCalled();
      });
    });
  });
});
