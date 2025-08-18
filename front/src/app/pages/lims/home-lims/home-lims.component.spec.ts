import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLimsComponent } from './home-lims.component';

describe('HomeLimsComponent', () => {
  let component: HomeLimsComponent;
  let fixture: ComponentFixture<HomeLimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLimsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeLimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
