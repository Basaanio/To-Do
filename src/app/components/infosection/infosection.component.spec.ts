import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfosectionComponent } from './infosection.component';

describe('InfosectionComponent', () => {
  let component: InfosectionComponent;
  let fixture: ComponentFixture<InfosectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfosectionComponent]
    });
    fixture = TestBed.createComponent(InfosectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
