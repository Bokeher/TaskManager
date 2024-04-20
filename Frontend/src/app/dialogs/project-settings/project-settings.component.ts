import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../session.service';
import { DataService } from '../../data.service';
import { Project } from '../../dataModels/project';
import { DeleteProjectComponent } from '../delete-project/delete-project.component';
import { Validate } from '../../validate';
import { User } from '../../dataModels/user';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.css'],
})
export class ProjectSettingsComponent implements OnInit {
  projectName?: string;
  projectNameForChange?: string;
  project?: Project;
  user?: User;
  userLogin?: string;
  adminPrivileges: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dataFromComponent: string,
    public dialog: MatDialog,
    private dataService: DataService,
    private sessionService: SessionService,
    private validate: Validate
  ) {}

  ngOnInit() {
    this.sessionService
      .getSelectedProjectObservable()
      .subscribe((selectedProject) => {
        if(selectedProject) {
          this.project = selectedProject;
          this.projectName = selectedProject?.name;
        }

        this.adminPrivileges = this.sessionService.userIsAdmin();
      });

    this.sessionService.getUserObservable().subscribe((user) => {
      if(user) this.user = user;
    });
  }
  
  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  changeProjectName(): void {
    if(!this.projectNameForChange || !this.project ||
      this.validate.validateProjectName(this.projectNameForChange).fails()) return;
  
    this.project.name = this.projectNameForChange;
    this.sessionService.setSelectedProject(this.project);

    const { _id, ...newProjectWithoutId } = this.project;
    if (_id) {
      this.updateProject(_id, newProjectWithoutId);
    }

    this.projectNameForChange = "";
  }

  leaveProject() {
    if(!this.project) return;
    if(!this.user) return;

    const userId = this.user._id;
    const projectMembers = this.project.projectMembers;
    this.project.projectMembers = projectMembers.filter((member) => member.userId !== userId);
    
    const projectId = this.project._id;
    const userProjectsIds = this.user.projectIds;
    this.user.projectIds = userProjectsIds.filter((id) => id !== projectId);
    
    this.updateCurrentUserData();
    this.updateCurrentProjectData();

    this.sessionService.setUser(this.user);
    this.sessionService.setSelectedProject(null);
    this.dialog.closeAll();
  }
  
  closeDialog(): void {
    this.dialog.closeAll();
  }

  deleteProject(): void {
    this.closeDialog();
    this.dialog.open(DeleteProjectComponent, {
      backdropClass: 'blur',
      autoFocus: false,
    });
  }

  addUser(): void {
    if (!this.userLogin) return;

    this.dataService.getUserByLogin(this.userLogin).subscribe(
      (response: User) => {
        if (!this.isMember(response)) {
          this.addUserToProject(response);
          this.addProjectToUser(response);
        }
      },
      (error) => {
        console.error(error);
      }
    );

    this.userLogin = "";
  }

  addUserToProject(user: User): void {
    if (!user) return;
    if (
      !user._id ||
      !this.project ||
      user._id == this.user?._id ||
      !this.project ||
      !this.project._id
    )
      return;

    this.project.projectMembers.push({
      userId: user._id,
      isAdmin: false,
    });

    this.sessionService.setSelectedProject(this.project);

    let { _id, ...newProject } = this.project;

    if (_id) {
      this.updateProject(_id, newProject);
    }
  }

  addProjectToUser(user: User): void {
    if (!user) return;
    if (
      !user._id ||
      !this.project ||
      user._id == this.user?._id ||
      !this.project ||
      !this.project._id
    )
      return;

    user.projectIds.push(this.project._id);

    const { _id, ...newUser } = user;

    this.updateUser(_id, newUser);
  }

  isMember(user: User): boolean {
    if (!this.project) return true;

    return this.project?.projectMembers.some((member) => {
      return member.userId === user._id;
    });
  }

  updateCurrentUserData() {
    if(!this.user) return;

    let { _id, ...user } = this.user;
    this.updateUser(_id!, user) 
  }

  updateCurrentProjectData() {
    if(!this.project) return;

    let { _id, ...project } = this.project;
    this.updateProject(_id!, project) 
  }

  updateUser(id: string, newUser: User): void {
    this.dataService.updateUser(id, newUser).subscribe(
      (response: User) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
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
