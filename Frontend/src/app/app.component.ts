import { Component, OnInit } from '@angular/core';
import { User } from './dataModels/user';
import { SessionService } from './session.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateProjectDialogComponent } from './dialogs/create-project/create-project-dialog.component';
import { UserSettingsDialogComponent } from './dialogs/user-settings/user-settings-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'TaskManager';
  displayProjects: boolean = false;
  user?: User;

  constructor(
    private sessionService: SessionService,
    public dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sessionService.getUserObservable().subscribe((user) => {
      this.user = user!;
    })

    if(!this.isLoggedIn()) {
      this.router.navigate(["/login"]);
    }
  }

  goToMainSite() {
    this.router.navigate(["/"]);
    this.displayProjects = false;
  }

  isLoggedIn(): boolean {
    if(this.user) return true;
    return false;
  }

  clearAllSessionData(): void {
    this.sessionService.logout();
  }
  
  closeDialog(): void {
    this.dialog.closeAll();
  }
  
  openCreateProjectDialog(): void {
    this.dialog.open(CreateProjectDialogComponent, {
      backdropClass: 'blur',
      autoFocus: false,
    });
  }

  openUserSettingsDialog(): void {
    this.closeDialog();
    this.dialog.open(UserSettingsDialogComponent, {
      backdropClass: 'blur',
      disableClose: false,
      autoFocus: false,
    });
  }

  displayUserProjects(): void {
    this.displayProjects = !this.displayProjects;
  }
}
