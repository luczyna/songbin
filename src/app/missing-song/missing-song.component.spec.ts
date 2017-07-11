import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingSongComponent } from './missing-song.component';

describe('MissingSongComponent', () => {
  let component: MissingSongComponent;
  let fixture: ComponentFixture<MissingSongComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissingSongComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissingSongComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
