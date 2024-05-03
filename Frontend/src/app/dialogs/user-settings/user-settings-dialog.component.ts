import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../session.service';
import { User } from '../../dataModels/user';
import { DataService } from '../../data.service';
import { Validate } from '../../validate';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styleUrls: ['./user-settings-dialog.component.css'],
})
export class UserSettingsDialogComponent extends Validate implements OnInit {
  password: string = '';
  avatarUrl: string = '';
  user?: User;
  output: string = '';

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    private validate: Validate,
    public dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.sessionService.getUserObservable().subscribe((user) => {
      this.user = user!;
    });
  }

  changePassword(): void {
    if (!this.user) return;

    if (this.validate.validatePassword(this.password).fails()) {
      this.output = 'Nieprawidłowe hasło.';
      return;
    }

    this.user.password = this.password;

    const { _id, ...newUserWithoutId } = this.user;

    if (_id && this.user._id) {
      this.updateUser(this.user._id, newUserWithoutId);
      this.output = 'Pomyślnie zmieniono hasło.';
    }

    this.password = "";
  }

  changeAvatar(): void {
    if (!this.user) return;

    this.user.avatarUrl = this.avatarUrl;

    const { _id, ...newUserWithoutId } = this.user;
    if (_id && this.user._id) {
      this.updateUser(this.user._id, newUserWithoutId);
      this.output = 'Pomyślnie zmieniono awatar.';
    }

    this.avatarUrl = "";
  }

  closeDialog(): void {
    this.dialog.closeAll();
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

  clearAllSessionData(): void {
    this.sessionService.logout();
    this.dialog.closeAll();

    this.router.navigate(["/login"]);
  }
}
