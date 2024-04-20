import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SessionService } from '../../session.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.css']
})
export class FilterDialogComponent implements OnInit {
  onlyAssigned: boolean = false;

  constructor(
    private sessionService: SessionService,     
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sessionService.getShowOnlyAssignedTasksObservable().subscribe((show) => {
      this.onlyAssigned = show;
    })
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
