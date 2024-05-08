import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';
import { Validate } from '../validate';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent extends Validate implements OnInit {
  user?: User;
  submitted: boolean = false;

  formData = {
    name: '',
    password: '',
    password_confirmation: '',
    email: '',
  };
  showPasswordRules = false;
  passwordMatch = false;

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    public validate: Validate,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.sessionService.getUserObservable().subscribe((user) => {
      if(user) this.router.navigate(["/"]);
    })
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  getUser(name: string, password: string, password_confirmation: string, email: string) {
    if (
      this.validate
        .validateRegistration(email, name, password, password_confirmation)
        .passes()
    ) {
      this.dataService.createUser(name, password, email).subscribe(
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
  }

  checkPassword() {
    if (this.validatePassword(this.formData.password).fails()) {
      this.showPasswordRules = true;
    } else {
      this.showPasswordRules = false;
    }
  }
  
  checkPasswords() {
    if (
      this.validatePasswordConfirmation(
        this.formData.password,
        this.formData.password_confirmation
      ).fails()
    ) {
      this.passwordMatch = true;
    } else {
      this.passwordMatch = false;
    }
  }
  
  onSubmit() {
    this.submitted = true;
    this.getUser(
      this.formData.name,
      this.formData.password,
      this.formData.password_confirmation,
      this.formData.email
    );
  }
}
