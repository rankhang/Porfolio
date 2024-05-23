import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostAudienceTemplateComponent } from './post-audience-template.component';

describe('PostAudienceTemplateComponent', () => {
  let component: PostAudienceTemplateComponent;
  let fixture: ComponentFixture<PostAudienceTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostAudienceTemplateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostAudienceTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
