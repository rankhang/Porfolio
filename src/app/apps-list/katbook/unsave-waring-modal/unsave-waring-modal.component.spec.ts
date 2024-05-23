import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsaveWaringModalComponent } from './unsave-waring-modal.component';

describe('UnsaveWaringModalComponent', () => {
  let component: UnsaveWaringModalComponent;
  let fixture: ComponentFixture<UnsaveWaringModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsaveWaringModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsaveWaringModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
