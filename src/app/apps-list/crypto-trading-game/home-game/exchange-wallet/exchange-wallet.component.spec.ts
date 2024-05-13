import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeWalletComponent } from './exchange-wallet.component';

describe('ExchangeWalletComponent', () => {
  let component: ExchangeWalletComponent;
  let fixture: ComponentFixture<ExchangeWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeWalletComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExchangeWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
