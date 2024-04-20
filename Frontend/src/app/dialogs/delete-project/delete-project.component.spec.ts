import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteProjectComponent } from './delete-project.component';

describe('DeleteProjectComponent', () => {
  let component: DeleteProjectComponent;
  let fixture: ComponentFixture<DeleteProjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeleteProjectComponent]
    });
    fixture = TestBed.createComponent(DeleteProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
