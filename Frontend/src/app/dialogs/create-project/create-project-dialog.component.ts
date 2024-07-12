import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { SessionService } from '../../session.service';
import { User } from '../../dataModels/user';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../dataModels/project';
import { Validate } from '../../validate';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-project-dialog',
  templateUrl: './create-project-dialog.component.html',
  styleUrls: ['./create-project-dialog.component.css'],
})
export class CreateProjectDialogComponent extends Validate implements OnInit {
  user?: User;
  formData = {
    projectName: '',
  };

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    public dialog: MatDialog,
    private validate: Validate,
    private router: Router,
    private toastr: ToastrService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sessionService.getUserObservable().subscribe((user) => {
      this.user = user!;
    });    
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  createProject(): any {
    if (
      !this.user?._id || 
      !this.user || 
      !this.validate.validateProjectName(this.formData.projectName, this.toastr)
    ) return;

    this.dataService
      .createProject(this.formData.projectName, this.user._id)
      .subscribe(
        (response: any) => {
          if (!this.user?._id || !this.user) return;

          this.user.projectIds.push(response.insertedId);

          const { _id, ...newUserWithoutId } = this.user;

          this.updateUser(_id, newUserWithoutId);
          this.sessionService.setUser(this.user);

          this.getProject(response.insertedId);
          this.dialog.closeAll();
        },
        (error) => {
          console.error(error);
        }
      );
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

  getProject(id: string): void {
    this.dataService.getProject(id).subscribe(
      (projectResponse: Project) => {
        if (projectResponse) {
          this.sessionService.setSelectedProject(projectResponse);

          this.router.navigate(["/project"]);
        }
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
