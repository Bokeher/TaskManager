import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { SessionService } from '../../session.service';
import { User } from '../../dataModels/user';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Project } from '../../dataModels/project';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-project-dialog',
  templateUrl: './delete-project-dialog.component.html',
  styleUrls: ['./delete-project-dialog.component.css'],
})
export class DeleteProjectDialogComponent implements OnInit {
  project?: Project;
  user?: User;

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    @Inject(MAT_DIALOG_DATA) public data: string,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionService.getSelectedProjectObservable().subscribe((project) => {
      if(project) this.project = project;
    });

    this.sessionService.getUserObservable().subscribe((user) => {
      if(user) this.user = user;
    });
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  deleteProject(): void {
    if (!this.project?._id) return;
    const projectId = this.project._id;

    this.dataService.deleteProject(this.project?._id).subscribe(() => {
      if (!this.user) return;

      // delete project from current user
      this.user.projectIds = this.user.projectIds.filter((id) => id != projectId);
      
      const { _id, ...newUserWithoutId } = this.user;

      if(_id) this.updateUser(_id, newUserWithoutId);
      this.sessionService.setUser(this.user);
      
      // delete project from other users
      this.deleteProjectFromUsers(projectId);

      this.router.navigate(["/"]);

      this.dialog.closeAll();
    }, (error) => {
      console.error(error);
    });
  }

  deleteProjectFromUsers(projectId: string) {
    if(!this.project) return;
    
    const projectMembers = this.project.projectMembers;
    for(const member of projectMembers) {
      const id = member.userId;
      this.dataService.getUserById(id).subscribe((user: User) => {
        user.projectIds = user.projectIds.filter((id) => id != projectId);

        const { _id, ...newUser } = user;
        
        if(_id) this.dataService.updateUser(_id, newUser).subscribe();
      });
    }
  }


  updateUser(id: string, newUser: User): void {
    this.dataService.updateUser(id, newUser).subscribe(
      (response: any) => {
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
