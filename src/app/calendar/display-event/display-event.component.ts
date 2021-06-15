import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { APICalendarEvent } from '../calendarEvent';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { formatDate } from 'src/app/config';
import { CalendarService } from 'src/app/services/calendar.service';
import { MatSelect } from '@angular/material/select';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-display-event',
  templateUrl: './display-event.component.html',
  styleUrls: ['./display-event.component.css']
})
export class DisplayEventComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DisplayEventComponent>, @Inject(MAT_DIALOG_DATA) public currentlyInEdit: APICalendarEvent,
  public calendarService : CalendarService, private authService : AuthService) { }

  whenBegins: string = formatDate(new Date(this.currentlyInEdit.whenBegins));
  whenEnds : string =  formatDate(new Date(this.currentlyInEdit.whenEnds));
  selectedGroups: number[] = [];
  availableGroups: string[] = this.authService.getTabs();

  ngOnInit(): void {
    
  }

  isRegistered(): boolean {
    return this.calendarService.getRegistration(this.currentlyInEdit) != null
  }

  registerForEvent(): void {
    
  }

  removeRegistrationForEvent(): void {
  
  }

  discard(): void {
    this.dialogRef.close();
  }  

}
