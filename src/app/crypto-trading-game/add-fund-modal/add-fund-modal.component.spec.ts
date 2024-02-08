import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFundModalComponent } from './add-fund-modal.component';

describe('AddFundModalComponent', () => {
  let component: AddFundModalComponent;
  let fixture: ComponentFixture<AddFundModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFundModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFundModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
