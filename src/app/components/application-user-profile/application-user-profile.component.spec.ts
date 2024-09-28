import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationUserProfileComponent } from './application-user-profile.component';

describe('ApplicationUserProfileComponent', () => {
  let component: ApplicationUserProfileComponent;
  let fixture: ComponentFixture<ApplicationUserProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicationUserProfileComponent]
    });
    fixture = TestBed.createComponent(ApplicationUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
