import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KatbookComponent } from './katbook.component';

describe('KatbookComponent', () => {
  let component: KatbookComponent;
  let fixture: ComponentFixture<KatbookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KatbookComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KatbookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
