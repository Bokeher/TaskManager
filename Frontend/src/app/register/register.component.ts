import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';
import { Validate } from '../validate';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user?: User;
  submitted: boolean = false;

  formData = {
    username: '',
    password: '',
    password_confirmation: '',
    email: '',
  };
  validEmail: boolean = true;
  validUsername: boolean = true;
  validPassword: boolean = true;
  passwordMatch: boolean = true;

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    public validate: Validate,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.sessionService.getUserObservable().subscribe((user) => {
      if(user) this.router.navigate(["/"]);
    })
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  getUser(
    username: string, password: string,
    password_confirmation: string, email: string
  ) {
    if (
      !this.validate.validateRegistration(
        email,
        username,
        password,
        password_confirmation,
        this.toastr
      )
    ) return;
  
    
    this.dataService.createUser(username, password, email).subscribe(
      (response: User) => {
        this.user = response;
        this.sessionService.setUser(this.user);
      },
      (error) => {
        console.error(error);
      }
    );

    this.router.navigate(["/"]);
  }

  checkEmail() {
    this.validEmail = this.validate.validateEmail(this.formData.email, this.toastr);

    if (!this.validEmail) {
      setTimeout(() => {
        this.validEmail = true;
      }, 100);
    }
  }

  checkUsername() {
    this.validUsername = this.validate.validateUsername(this.formData.username, this.toastr);

    if (!this.validUsername) {
      setTimeout(() => {
        this.validUsername = true;
      }, 100);
    }
  }

  checkPassword() {
    this.validPassword = this.validate.validatePassword(this.formData.password, this.toastr);

    if (!this.validPassword) {
      setTimeout(() => {
        this.validPassword = true;
      }, 100);
    }
  }

  checkPasswords() {
    this.passwordMatch = !this.validate.validatePasswordConfirmation(
      this.formData.password,
      this.formData.password_confirmation,
      this.toastr
    );

    if (!this.passwordMatch) {
      setTimeout(() => {
        this.passwordMatch = true;
      }, 100);
    }
  }
  
  onSubmit() {
    this.submitted = true;
    this.getUser(
      this.formData.username,
      this.formData.password,
      this.formData.password_confirmation,
      this.formData.email
    );
  }
}
