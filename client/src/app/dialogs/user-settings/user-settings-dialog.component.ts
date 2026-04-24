import { Component, OnDestroy, OnInit } from '@angular/core';
import { SessionService } from '../../session.service';
import { User } from '../../dataModels/user';
import { DataService } from '../../data.service';
import { Validate } from '../../validate';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-user-settings-dialog',
    templateUrl: './user-settings-dialog.component.html',
    styleUrls: ['./user-settings-dialog.component.css'],
    standalone: false
})
export class UserSettingsDialogComponent extends Validate implements OnInit, OnDestroy {
  password: string = '';
  avatarUrl: string = '';
  user?: User;
  output: string = '';

  private destroy = new Subject<void>();

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    private validate: Validate,
    public dialog: MatDialog,
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

  changePassword(): void {
    if (!this.user || !this.validate.validatePassword(this.password, this.toastr)) return;

    this.user.password = this.password;

    const { _id, ...newUserWithoutId } = this.user;

    if (_id && this.user._id) {
      this.updateUser(this.user._id, newUserWithoutId);
      this.toastr.success("Password changed")
    }

    this.password = "";
  }

  changeAvatar(): void {
    if (!this.user) return;

    this.user.avatarUrl = this.avatarUrl;

    const { _id, ...newUserWithoutId } = this.user;
    if (_id && this.user._id) {
      this.updateUser(this.user._id, newUserWithoutId);
      this.toastr.success("Avatar url changed")
    }

    this.avatarUrl = "";
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  updateUser(id: string, newUser: User): void {
    this.dataService.updateUser(id, newUser).subscribe({
      next: () => {},
      error: (error) => {
        console.error(error);
      }
    });
  }

  clearAllSessionData(): void {
    this.sessionService.logout();
    this.dialog.closeAll();

    this.router.navigate(["/login"]);
  }
}
