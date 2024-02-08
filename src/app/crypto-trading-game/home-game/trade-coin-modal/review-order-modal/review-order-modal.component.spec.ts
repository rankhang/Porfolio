import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOrderModalComponent } from './review-order-modal.component';

describe('ReviewOrderModalComponent', () => {
  let component: ReviewOrderModalComponent;
  let fixture: ComponentFixture<ReviewOrderModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewOrderModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewOrderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
