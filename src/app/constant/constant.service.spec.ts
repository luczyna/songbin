import { TestBed, inject } from '@angular/core/testing';

import { ConstantService } from './constant.service';

describe('ConstantService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ ConstantService ]
    });
  });

  it('should be created', inject([ConstantService], (service: ConstantService) => {
    expect(service).toBeTruthy();
  }));

  describe('`urlRegex`', () => {
    let service = new ConstantService();

    it('should be available', () => {
      expect(service.urlRegex).toBeDefined();
    });

    it('should match a youtube URL', () => {
      let testThis = [
        // from URL
        'https://www.youtube.com/watch?v=P-BqmegCUpA',
        // from share button
        'https://youtu.be/NntQ86FHcMY',
        // from embed code
        'https://www.youtube.com/embed/NntQ86FHcMY',
        // from copying on the video list page
        'https://www.youtube.com/watch?v=sOzM4ClFG1o',
        // without https
        'https://www.youtube.com/watch?v=sOzM4ClFG1o'
      ];

      testThis.forEach((url) => {
        expect(service.urlRegex.test(url)).toBeTruthy();
      });
    });
  });
});
