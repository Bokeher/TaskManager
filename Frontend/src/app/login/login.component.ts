import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataService } from '../data.service';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit{
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

  ngOnInit(): void {
    this.sessionService.getUserObservable().subscribe((user) => {
      if(user) this.router.navigate(["/"]);
    })
  }

  @ViewChild('autoSelect') autoSelect!: ElementRef;
  ngAfterViewInit(): void {
    this.autoSelect.nativeElement.focus();
  }

  getUser(email: string, name: string, password: string) {
    this.dataService.getUser(email, name, password).subscribe(
      (response: User) => {
        this.user = response;

        if(!this.user) {
          this.showError = true;
          return;
        }

        this.sessionService.setUser(this.user);
        this.router.navigate(["/"]);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onSubmit() {
    this.getUser(
      this.formData.email,
      this.formData.name,
      this.formData.password
    );
  }
}
