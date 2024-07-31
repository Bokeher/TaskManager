import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../../session.service';
import { DataService } from '../../data.service';
import { Project } from '../../dataModels/project';
import { DeleteProjectDialogComponent } from '../delete-project/delete-project-dialog.component';
import { Validate } from '../../validate';
import { User } from '../../dataModels/user';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-project-settings-dialog',
  templateUrl: './project-settings-dialog.component.html',
  styleUrls: ['./project-settings-dialog.component.css'],
})
export class ProjectSettingsDialogComponent implements OnInit {
  projectName?: string;
  project?: Project;
  user?: User;
  userLogin?: string;
  adminPrivileges: boolean = false;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private sessionService: SessionService,
    private validate: Validate,
    private toastr: ToastrService
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
    if (
      !this.validate.validateProjectName(this.projectName, this.toastr) || 
      !this.projectName || 
      !this.project 
    ) return;
  
    this.project.name = this.projectName;
    this.sessionService.setSelectedProject(this.project);

    const { _id, ...newProjectWithoutId } = this.project;
    if (_id) {
      this.updateProject(_id, newProjectWithoutId);
    }
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
    this.dialog.open(DeleteProjectDialogComponent, {
      backdropClass: 'blur',
      hasBackdrop: true,
    });
  }

  addUser(): void {
    if (
      !this.validate.validateUsername(this.userLogin, this.toastr) || 
      !this.userLogin
    ) return;
    
    this.dataService.getUserByLogin(this.userLogin).subscribe(
      (response: User) => {
        if(this.isMember(response)) {
          // TODO: handle this with toast system
          return;
        }

        this.addUserToProject(response);
        this.addProjectToUser(response);
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
