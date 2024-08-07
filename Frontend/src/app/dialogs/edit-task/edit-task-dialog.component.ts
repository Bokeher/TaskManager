import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DataService } from '../../data.service';
import { SessionService } from '../../session.service';
import { Task } from '../../dataModels/task';
import { Project } from '../../dataModels/project';
import { User } from '../../dataModels/user';
import { BehaviorSubject, Subscription, forkJoin, map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-task-dialog',
  templateUrl: './edit-task-dialog.component.html',
  styleUrls: ['./edit-task-dialog.component.css'],
})
export class EditTaskDialogComponent implements OnInit {
  project?: Project;
  newTaskName?: string;
  newTaskDescription?: string;
  userToAdd?: string;
  originalTask?: Task;

  loadingComplete: boolean = false;

  members: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  members$ = this.members.asObservable();
  private subscriptionMember!: Subscription;

  constructor(
    @Inject(MAT_DIALOG_DATA) public task: Task,
    public dialog: MatDialog,
    private sessionService: SessionService,
    private dataService: DataService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.originalTask = JSON.parse(JSON.stringify(this.task));

    this.sessionService.getSelectedProjectObservable().subscribe((project) => {
      if(project) this.project = project;
    });

    const usersIds = [...new Set(this.task.memberIds)];

    this.subscriptionMember = forkJoin(
      usersIds.map((id) => this.dataService.getUserById(id))
    ).subscribe((members) => {
      this.members.next(members);
      this.loadingComplete = true;
    });
  }

  ngOnDestroy(): void {
    if(this.task.name.length < 1) return;
    
    this.editTaskName();
    this.editTaskDescription();
  }
  
  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  editTaskName(): void {
    if (!this.project || this.originalTask?.name === this.task.name) return;

    this.project.tasks.forEach((task) => {
      if (JSON.stringify(task) === JSON.stringify(this.task)) {
        if (!this.project) return;

        task.name = this.task.name;

        this.sessionService.setSelectedProject(this.project);

        const { _id, ...newProject } = this.project;
        if (_id) this.updateProject(_id, newProject);
      }
    });
  }

  editTaskDescription(): void {
    if (!this.project || this.originalTask?.description === this.task.description) return;

    this.project.tasks.forEach((task) => {
      if (JSON.stringify(task) === JSON.stringify(this.task)) {
        if (!this.project) return;

        task.description = this.task.description;

        this.sessionService.setSelectedProject(this.project);

        const { _id, ...newProject } = this.project;
        if (_id) this.updateProject(_id, newProject);
      }
    });
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

  addUserToTask(): void {
    if(!this.userToAdd) {
      this.toastr.error("Please enter username");
      return;
    }

    this.dataService.getUserByLogin(this.userToAdd).subscribe(
      (response: User) => {
        if (!this.project) return;
        if (!response._id) return;
        
        let containsUser = false;

        this.project?.projectMembers.forEach((member) => {
          if(member.userId == response._id){
            containsUser = true;
          }
        });

        if(!containsUser) return;

        if(this.task.memberIds.includes(response._id)) {
          this.toastr.error("This user is already assigned to this task.")
          return;
        }

        this.project.tasks.forEach((task) => {
          if (JSON.stringify(task) === JSON.stringify(this.task)) {
            if(!response._id) return;
            if (!this.project) return;

            task.memberIds.push(response._id);
            this.sessionService.setSelectedProject(this.project);

            const { _id, ...newProject } = this.project;
            if (_id) this.updateProject(_id, newProject);
          }
        });
      },
      (error) => {
        console.error(error);
      }
    );

    this.userToAdd = "";
  }

  removeUserFromTask(user: User) {
    if(!this.project) return;
    
    this.project.tasks.forEach((task) => {
      if (JSON.stringify(task) === JSON.stringify(this.task)) {
        if(!this.project) return;

        task.memberIds = this.task.memberIds.filter((id) => {
          return id !== user._id
        })

        this.members.next(this.members.value.filter(member => member._id !== user._id));

        this.sessionService.setSelectedProject(this.project);

        const { _id, ...newProject } = this.project;
        if (_id) this.updateProject(_id, newProject);    
      }
    });     
  }
}
