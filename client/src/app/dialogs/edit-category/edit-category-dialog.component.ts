import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../session.service';
import { Project } from '../../dataModels/project';
import { DataService } from '../../data.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-edit-category-dialog',
    templateUrl: './edit-category-dialog.component.html',
    styleUrls: ['./edit-category-dialog.component.css'],
    standalone: false
})
export class EditCategoryComponent implements OnInit {
  categoryName = '';
  project?: Project;

  private destroy = new Subject<void>();
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public oldCategory: string,
    public dialog: MatDialog,
    private sessionService: SessionService,
    private dataService: DataService
  ) {
    this.categoryName = this.oldCategory;
  }

  ngOnInit(): void {
    this.sessionService.getSelectedProjectObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((project) => {
        if(project) this.project = project;
      });
  }

  ngOnDestroy(): void {
    this.saveCategoryName();
    this.destroy.next();
    this.destroy.complete();
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  saveCategoryName() {
    if (!this.project || this.categoryName.length < 1) return;
    
    const categoryIndex = this.project.categories.findIndex(category => category === this.oldCategory);
    if (categoryIndex !== -1) {
      this.project.categories[categoryIndex] = this.categoryName;
      
      this.project.tasks.forEach(task => {
        if(task.category === this.oldCategory) {
          task.category = this.categoryName;
        }
      });

      this.oldCategory = this.categoryName;
      this.sessionService.setSelectedProject(this.project);
    }
  }

  updateProject(id: string, newProject: Project): void {
    this.dataService.updateProject(id, newProject).subscribe({
      next: (response: Project) => {
        console.log(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
