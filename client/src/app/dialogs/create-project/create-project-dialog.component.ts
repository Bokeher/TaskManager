import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../../data.service';
import { SessionService } from '../../session.service';
import { User } from '../../dataModels/user';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../dataModels/project';
import { Validate } from '../../validate';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-create-project-dialog',
    templateUrl: './create-project-dialog.component.html',
    styleUrls: ['./create-project-dialog.component.css'],
    standalone: false
})
export class CreateProjectDialogComponent extends Validate implements OnInit, OnDestroy {
  user?: User;
  formData = {
    projectName: '',
  };

  private destroy = new Subject<void>();

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
    this.sessionService.getUserObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((user) => {
        this.user = user!;
      });    
  }

  ngOnDestroy(): void {
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

  createProject(): any {
    if (
      !this.user?._id || 
      !this.user || 
      !this.validate.validateProjectName(this.formData.projectName, this.toastr)
    ) return;

    this.dataService
      .createProject(this.formData.projectName)
      .subscribe({
        next: (response: any) => {
          if (!this.user?._id || !this.user) return;

          this.user.projectIds.push(response.insertedId);

          const { _id, ...newUserWithoutId } = this.user;

          this.updateUser(_id, newUserWithoutId);
          this.sessionService.setUser(this.user);

          this.getProject(response.insertedId);
          this.dialog.closeAll();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  updateUser(id: string, newUser: User): void {
    this.dataService.updateUser(id, newUser).subscribe({
      next: () => {},
      error: (error) => {
        console.error(error);
      }
    });
  }

  getProject(id: string): void {
    this.dataService.getProject(id).subscribe({
      next: (projectResponse: Project) => {
        if (projectResponse) {
          this.sessionService.setSelectedProject(projectResponse);

          this.router.navigate(["/project"]);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }
}
