import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Project } from '../../dataModels/project';
import { DataService } from '../../data.service';
import { SessionService } from '../../session.service';
import { Task } from '../../dataModels/task';
import { Validate } from 'src/app/validate';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-task-dialog',
  templateUrl: './create-task-dialog.component.html',
  styleUrls: ['./create-task-dialog.component.css'],
})
export class CreateTaskDialogComponent implements OnInit {
  project?: Project;
  task?: Task;
  formData = {
    name: '',
    description: '',
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataFromComponent: string,
    public dialog: MatDialog,
    private dataService: DataService,
    private sessionService: SessionService,
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

  createTask(): void {
    if (!this.project?._id) return;
    
    if(!this.validate.validateTask(this.formData.name, this.formData.description, this.toastr)) {
      return;
    }

    this.task = new Task(
      this.formData.name,
      this.formData.description,
      '',
      [],
      this.dataFromComponent
    );
    
    this.project.tasks.unshift(this.task);

    this.sessionService.setSelectedProject(this.project);
    const { _id, ...project } = this.project;

    this.updateProject(_id, project);

    this.formData.name = "";
    this.formData.description = "";
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
