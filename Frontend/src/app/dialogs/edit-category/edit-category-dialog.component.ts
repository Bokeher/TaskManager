import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../session.service';
import { Project } from '../../dataModels/project';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-edit-category-dialog',
  templateUrl: './edit-category-dialog.component.html',
  styleUrls: ['./edit-category-dialog.component.css'],
})
export class EditCategoryComponent implements OnInit {
  categoryName = '';
  project?: Project;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog,
    private sessionService: SessionService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.sessionService.getSelectedProjectObservable().subscribe((project) => {
      if(project) this.project = project;
    });
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    // this.autoSelect.nativeElement.focus();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  createCategory() {
    console.log(this.categoryName);

    if (
      !this.project ||
      !this.project._id ||
      (this.project.categories &&
        this.project.categories.includes(this.categoryName))
    ) {
      return;
    }

    this.project.categories.push(this.categoryName);
    this.sessionService.setSelectedProject(this.project);

    const { _id, ...project } = this.project;

    this.updateProject(_id, project);

    this.categoryName = "";
  }

  updateProject(id: string, newProject: Project): void {
    this.dataService.updateProject(id, newProject).subscribe(
      (response: Project) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
