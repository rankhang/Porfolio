import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CryptoTradingGameComponent } from './crypto-trading-game.component';

describe('CryptoTradingGameComponent', () => {
  let component: CryptoTradingGameComponent;
  let fixture: ComponentFixture<CryptoTradingGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CryptoTradingGameComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CryptoTradingGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
