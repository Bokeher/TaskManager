import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';
import { Validate } from '../validate';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { AuthResponse } from '../dataModels/authResponse';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
    standalone: false
})
export class RegisterComponent implements OnInit, OnDestroy {
  user?: User;
  submitted: boolean = false;
  isLoading: boolean = false;

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

  private destroy = new Subject<void>();
  
  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    public validate: Validate,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.sessionService.getUserObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((user) => {
        if(user) this.router.navigate(["/"]);
      })
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
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
  
    this.isLoading = true;
    
    this.dataService.createUser(username, password, email).subscribe({
      next: (response: AuthResponse | null) => {
        if (response == null) {
          const message = $localize`:@@usernameTaken: Username taken`;
          this.toastr.error(message);
          this.isLoading = false;
          return;
        }
        
        this.user = response.user;
        this.sessionService.setToken(response.token);
        this.sessionService.setUser(this.user);
        this.router.navigate(["/"]);
      },
      error: (error) => {
        this.isLoading = false;
        console.error(error);
      }
    });
  }

  checkEmail() {
    this.validEmail = this.validate.validateEmail(this.formData.email, this.toastr);

    this.validEmailShake = !this.validEmail;

    if (this.validEmailShake) {
      setTimeout(() => {
        this.validEmailShake = false;
      }, 100);
    }
  }

  checkUsername() {
    this.validUsername = this.validate.validateUsername(this.formData.username, this.toastr);

    this.validUsernameShake = !this.validUsername;

    if (this.validUsernameShake) {
      setTimeout(() => {
        this.validUsernameShake = false;
      }, 100);
    }
  }

  checkPassword() {
    this.validPassword = this.validate.validatePassword(this.formData.password, this.toastr);

    this.validPasswordShake = !this.validPassword;

    if (this.validPasswordShake) {
      setTimeout(() => {
        this.validPasswordShake = false;
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
