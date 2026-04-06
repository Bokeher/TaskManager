import { Component, OnInit } from '@angular/core';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  user?: User;

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getUserObservable().subscribe((user) => {
      this.user = user ?? undefined;
    });
  }
}
