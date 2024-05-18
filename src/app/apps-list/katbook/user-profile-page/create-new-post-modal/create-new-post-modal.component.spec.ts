import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPostModalComponent } from './create-new-post-modal.component';

describe('CreateNewPostModalComponent', () => {
  let component: CreateNewPostModalComponent;
  let fixture: ComponentFixture<CreateNewPostModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewPostModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
