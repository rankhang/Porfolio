import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulticolorAnimationBackgroundComponent } from './multicolor-animation-background.component';

describe('MulticolorAnimationBackgroundComponent', () => {
  let component: MulticolorAnimationBackgroundComponent;
  let fixture: ComponentFixture<MulticolorAnimationBackgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MulticolorAnimationBackgroundComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MulticolorAnimationBackgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
