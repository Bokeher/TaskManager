import { Component, OnDestroy, OnInit } from '@angular/core';
import { User } from '../dataModels/user';
import { SessionService } from '../session.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit, OnDestroy {
  user?: User;
  private destroy = new Subject<void>();

  constructor(private sessionService: SessionService) {}

  ngOnInit(): void {
    this.sessionService.getUserObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((user) => {
        this.user = user ?? undefined;
      });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
