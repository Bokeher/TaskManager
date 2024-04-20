import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showError: boolean = false;
  user?: User;
  formData = {
    email: '',
    name: '',
    password: '',
  };

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    private router: Router
  ) {}

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  getUser(email: string, name: string, password: string) {
    this.dataService.getUser(email, name, password).subscribe(
      (response: User) => {
        this.user = response;
        console.log(this.user);
        this.logInUser();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  logInUser() {
    if (this.user) {
      this.sessionService.setUser(this.user);
      this.router.navigate(["/"]);
    } else {
      this.showError = true;
    }
  }

  onSubmit() {
    this.getUser(
      this.formData.email,
      this.formData.name,
      this.formData.password
    );
  }
}
