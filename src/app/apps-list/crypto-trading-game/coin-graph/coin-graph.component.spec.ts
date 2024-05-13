import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinGraphComponent } from './coin-graph.component';

describe('CoinGraphComponent', () => {
  let component: CoinGraphComponent;
  let fixture: ComponentFixture<CoinGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
