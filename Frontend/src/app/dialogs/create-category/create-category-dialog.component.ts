import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../session.service';
import { Project } from '../../dataModels/project';
import { DataService } from '../../data.service';
import { Validate } from 'src/app/validate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-category-dialog',
  templateUrl: './create-category-dialog.component.html',
  styleUrls: ['./create-category-dialog.component.css'],
})
export class CreateCategoryDialogComponent implements OnInit {
  categoryName = '';
  project?: Project;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog,
    private sessionService: SessionService,
    private dataService: DataService,
    private validate: Validate,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.sessionService.getSelectedProjectObservable().subscribe((project) => {
      if(project) this.project = project;
    });
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  createCategory() {
    if (
      !this.project ||
      !this.project._id ||
      (this.project.categories && this.project.categories.includes(this.categoryName)) ||
      !this.validate.validateCategoryName(this.categoryName, this.toastr)
    ) return;

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
