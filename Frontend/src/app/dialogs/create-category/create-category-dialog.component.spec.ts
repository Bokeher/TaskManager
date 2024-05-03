import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategoryComponent } from './create-category-dialog.component';

describe('AddCategoryDialogComponent', () => {
  let component: CreateCategoryComponent;
  let fixture: ComponentFixture<CreateCategoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCategoryComponent]
    });
    fixture = TestBed.createComponent(CreateCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
