import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { APICalendarEvent } from '../calendarEvent';
import {MatDatepickerModule} from '@angular/material/datepicker'
import { formatDate } from 'src/app/config';
import { CalendarService } from 'src/app/services/calendar.service';
import { MatSelect } from '@angular/material/select';
import { AuthService } from 'src/app/auth/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
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

  ngOnInit(): void {
    
  }

  isRegistered(): boolean {
    let registraction = this.calendarService.getRegistration(this.currentlyInEdit);
    if (registraction == null) return false;
    return true;
  }

  isItInvitation(): boolean {
    let registraction = this.calendarService.getRegistration(this.currentlyInEdit);
    if (registraction == null) return false;
    return registraction.hasOwnerConfirmed && !registraction.hasParticipantConfirmed;
  }

  registerForEvent(): void {
    this.calendarService.registerForEvent(this.currentlyInEdit, (x: string) => { }, (err: HttpErrorResponse) => { }); 
  }

  removeRegistrationForEvent(): void {
    this.calendarService.removeRegistraction(this.currentlyInEdit, (x: string) => { }, (err: HttpErrorResponse) => { }); 
  }

  acceptInvitation(): void {
    this.calendarService.acceptInvitation(this.currentlyInEdit, (x: string) => { }, (err: HttpErrorResponse) => { }); 
  }

  getCategoryName(): string {
    let temp = this.calendarService.getEventCategory(this.currentlyInEdit.category);
    if (temp == null) return "";
    else return temp.name;
  }

  discard(): void {
    this.dialogRef.close();
  }  

}
