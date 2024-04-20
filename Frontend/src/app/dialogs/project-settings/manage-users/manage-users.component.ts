import { Component } from '@angular/core';
import { SessionService } from '../../../session.service';
import { DataService } from '../../../data.service';
import { MatDialog } from '@angular/material/dialog';
import { zip, from  } from 'rxjs';
import { map } from 'rxjs/operators';

import { Project } from '../../../dataModels/project';
import { ProjectMember } from '../../../dataModels/projectMember';
import { User } from '../../../dataModels/user';
import { ManagingUser } from '../../../dataModels/managingUser';

@Component({
  selector: '[app-manage-users]',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css'],
})
export class ManageUsersComponent {
  projectMembers?: ProjectMember[];
  project?: Project;
  userId?: string;
  mergedData: ManagingUser[] = [];
  userNumber = 0;
  adminPrivileges: boolean = false;

  constructor(
    private sessionService: SessionService,
    private dataService: DataService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.mergedData = [];

    this.sessionService
      .getSelectedProjectObservable()
      .subscribe((selectedProject) => {
        if (selectedProject) {
          this.project = selectedProject;
          this.userNumber = this.project.projectMembers.length;

          this.mergedData = [];
          this.getAllMembersAndPushToArray();

          this.adminPrivileges = this.sessionService.userIsAdmin();
        }
      });

    this.sessionService.getUserObservable().subscribe((user) => {
      if(user && user._id) this.userId = user._id;
    })
  }

  getAllMembersAndPushToArray() {
    if (!this.project?.projectMembers) return;
  
    zip(
      ...this.project.projectMembers.map(member => {
        return from(
          this.getUserById(member.userId).pipe(
            map((response: User) => {
              if (response == null) return null;
              return new ManagingUser(
                response.login,
                member.isAdmin,
                member.userId
              );
            })
          )
        );
      })
    ).subscribe((results: (ManagingUser | null)[]) => {
      results.forEach(managingUser => {
        if (managingUser) {
          this.mergedData.push(managingUser);
        }
      });
    });
  }

  getUserById(id: any) {
    return this.dataService.getUserById(id);
  }

  onCheckedChange(login: string, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    this.mergedData.forEach((member) => {
      if (member.login == login) {
        if (this.project?.projectMembers) {
          this.project.projectMembers.forEach((pMember) => {
            if (pMember.userId == member.id) {
              pMember.isAdmin = isChecked;
            }
          });
        }
      }
    });

    if (!this.project || !this.project._id) return;
    this.sessionService.setSelectedProject(this.project);

    const { _id, ...newProject } = this.project;

    this.updateProject(_id, newProject);
  }

  removeUser(user: ManagingUser) {
    if (!this.project?.projectMembers || !this.project || !this.project._id)
      return;

    this.project.projectMembers = this.project.projectMembers.filter(
      (member) => member.userId !== user.id
    );

    this.sessionService.setSelectedProject(this.project);

    const { _id, ...newProject } = this.project;

    this.updateProject(_id, newProject);
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
