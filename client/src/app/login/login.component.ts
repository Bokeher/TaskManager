import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthResponse } from '../dataModels/authResponse';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  showError: boolean = false;
  user?: User;
  formData = {
    email: '',
    name: '',
    password: '',
  };
  
  private destroy = new Subject<void>();

  constructor(
    private dataService: DataService,
    private sessionService: SessionService,
    private router: Router
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

  getUser(email: string, name: string, password: string) {
    this.dataService.getUser(email, name, password).subscribe({
      next: (response: AuthResponse | null) => {
        this.user = response?.user;

        if(!response || !this.user) {
          this.showError = true;
          return;
        }

        this.sessionService.setToken(response.token);
        this.sessionService.setUser(this.user);
        this.router.navigate(["/"]);
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  onSubmit() {
    this.getUser(
      this.formData.email,
      this.formData.name,
      this.formData.password
    );
  }
}
