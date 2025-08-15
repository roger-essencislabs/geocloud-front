import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsTypeComponent } from './projects-type.component';

describe('ProjectsTypeComponent', () => {
  let component: ProjectsTypeComponent;
  let fixture: ComponentFixture<ProjectsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsTypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
