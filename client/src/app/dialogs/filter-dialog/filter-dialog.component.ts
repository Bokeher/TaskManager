import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../session.service';
import { MatDialog } from '@angular/material/dialog';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'app-filter-dialog',
    templateUrl: './filter-dialog.component.html',
    styleUrls: ['./filter-dialog.component.css'],
    standalone: false
})
export class FilterDialogComponent implements OnInit {
  onlyAssigned: boolean = false;

  private destroy = new Subject<void>();
  
  constructor(
    private sessionService: SessionService,     
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sessionService.getShowOnlyAssignedTasksObservable()
      .pipe(takeUntil(this.destroy))
      .subscribe((show) => {
        this.onlyAssigned = show;
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

  onCheckedChange(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.sessionService.setShowOnlyAssignedTasks(isChecked);
  }

  closeDialogs(): void {
    this.dialog.closeAll();
  }
}
