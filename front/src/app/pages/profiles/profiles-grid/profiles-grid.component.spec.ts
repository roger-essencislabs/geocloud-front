import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilesGridComponent } from './profiles-grid.component';

describe('ProfilesGridComponent', () => {
  let component: ProfilesGridComponent;
  let fixture: ComponentFixture<ProfilesGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfilesGridComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilesGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
