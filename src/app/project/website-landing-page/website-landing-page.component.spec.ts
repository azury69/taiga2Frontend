import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebsiteLandingPageComponent } from './website-landing-page.component';

describe('WebsiteLandingPageComponent', () => {
  let component: WebsiteLandingPageComponent;
  let fixture: ComponentFixture<WebsiteLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WebsiteLandingPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WebsiteLandingPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
