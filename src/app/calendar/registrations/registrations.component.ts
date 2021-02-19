import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { APICalendarEvent, Participation } from '../calendarEvent';
import { CombineUrls, apiUrl, Where, GetUser } from 'src/app/config';
import { HttpParams, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { UserInfo } from 'src/app/login/user';

declare let showToast: Function;

@Component({
  selector: 'app-registrations',
  templateUrl: './registrations.component.html',
  styleUrls: ['./registrations.component.css']
})
export class RegistrationsComponent implements OnInit {

  @Input()
  calendarEvents: APICalendarEvent[] = [];

  @Input()
  update: number = 0;

  participations: Participation[][] = [];

  @Output()
  areThereAny: EventEmitter<boolean> = new EventEmitter<boolean>();
    
  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.areThereAny.emit(this.AreThereAnyToConfirm());
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updateData();
  }

  updateData() {
    let email = (GetUser() as UserInfo).email;
    this.calendarEvents = Where(this.calendarEvents, (f: APICalendarEvent) => f.creatorEmail == email);
    for (let k of this.calendarEvents)
      this.fetchParticipationsForEvent(k);
    this.areThereAny.emit(this.AreThereAnyToConfirm());
  }

  fetchParticipationsForEvent(e:APICalendarEvent ) : void {
    let params = new HttpParams().set("eventID", e.id);
    this.http.get<Participation[]>(CombineUrls(apiUrl, "Calendar/participations"), { params })
      .subscribe((observer) => {
        this.participations[this.calendarEvents.indexOf(e)] = [];
        if (observer.length > 0)
          for (let k of observer)
            if(!k.hasOwnerConfirmed)
              this.participations[this.calendarEvents.indexOf(e)].push(k);
        else this.participations[this.calendarEvents.indexOf(e)] = new Array<Participation>();
      }, (err : HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
      });
  }

  getEventById(id: string): APICalendarEvent {
    let result = Where(this.calendarEvents, (f: APICalendarEvent) => f.id == id);
    return result[0];
  }

  emailToFancyName(email: string): string {
    email = email.substr(0, email.indexOf('@'));
    email = email.substr(0, 1).toUpperCase() + email.substr(1);
    let index = email.indexOf('.') + 1;
    email = email.substr(0, index) + email.substr(index, 1).toUpperCase() + email.substr(index + 1);
    email = email.replace('.', ' ');
    return email;
  }

  confirmParticipation(p: Participation) {
    console.log(p.id);
    this.http.post(CombineUrls(apiUrl, "Calendar/participation"), p)
      .subscribe(() => {
        showToast("Pomyślnie zaakceptowano");
        this.updateData();
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
    })
  }

  removeParticipation(p: Participation) {
    let data = {
      calendarEventID: p.calendarEventId,
      owner: (GetUser() as UserInfo).email
    }
    const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: data,
		  };
    this.http.delete(CombineUrls(apiUrl, "Calendar/participations"), options)
      .subscribe(() => {
        showToast("Udało się usunąć rejestrację");
        this.fetchParticipationsForEvent(this.getEventById(p.id));
      }, (err: HttpErrorResponse) => {
          showToast("Cos poszło nie tak :(")
    })
  }

  AreThereAnyToConfirm() {
    let output = false;
    for (let k of this.participations) {
    if (k != undefined && k.length > 0) output = true;
    }
    this.areThereAny.emit(output);
    return output;
  }

}
