import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCoinModalComponent } from './trade-coin-modal.component';

describe('BuyCoinModalComponent', () => {
  let component: BuyCoinModalComponent;
  let fixture: ComponentFixture<BuyCoinModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyCoinModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuyCoinModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
