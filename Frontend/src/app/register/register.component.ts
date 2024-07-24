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

  validEmailShake: boolean = false;
  validUsernameShake: boolean = false;
  validPasswordShake: boolean = false;
  passwordMatchShake: boolean = false;

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

    this.validEmailShake = !this.validEmail;

    if (this.validEmailShake) {
      setTimeout(() => {
        this.validEmailShake = true;
      }, 100);
    }
  }

  checkUsername() {
    this.validUsername = this.validate.validateUsername(this.formData.username, this.toastr);

    this.validUsernameShake = !this.validUsername;

    if (this.validUsernameShake) {
      setTimeout(() => {
        this.validUsernameShake = true;
      }, 100);
    }
  }

  checkPassword() {
    this.validPassword = this.validate.validatePassword(this.formData.password, this.toastr);

    this.validPasswordShake = !this.validPassword;

    if (this.validPasswordShake) {
      setTimeout(() => {
        this.validPasswordShake = true;
      }, 100);
    }
  }

  checkPasswords() {
    this.passwordMatch = this.validate.validatePasswordConfirmation(
      this.formData.password,
      this.formData.password_confirmation,
      this.toastr
    );

    this.passwordMatchShake = !this.passwordMatch;
    
    if (this.passwordMatchShake) {
      setTimeout(() => {
        this.passwordMatchShake = false;
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

  clearToast() {
    this.toastr.clear();
  }
}
