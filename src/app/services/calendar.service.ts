import { Injectable } from '@angular/core';
import { APICalendarEvent, Participation, CategoryCalendarEvent, configureParticipationForRegistrator } from '../calendar/calendarEvent';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { CombineUrls, apiUrl } from '../config';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private calendarEvents: APICalendarEvent[] = [];
  private registrationStatusForEvent: Participation[] = [];
  private eventCategories: CategoryCalendarEvent[] = [];
  private registrations: Participation[] = [];

  constructor(private http: HttpClient, private authService: AuthService) { }

  update(): void {

  }

  getCalendarEvents(): Observable<APICalendarEvent[]> {
    return of(this.calendarEvents);
  }

  getRegistration(event: APICalendarEvent): Participation | null {
    for (let i = 0; i < this.registrationStatusForEvent.length; i++)
      if (this.registrationStatusForEvent[i].calendarEventId == event.id)
        return this.registrationStatusForEvent[i];
    return null;
  }

  getEventCategories(): Observable<CategoryCalendarEvent[]> {
    return of(this.eventCategories);
  }

  getEventCategory(id: string): CategoryCalendarEvent | null {
    for (let i = 0; i < this.eventCategories.length; i++)
      if (this.eventCategories[i].id == id)
        return this.eventCategories[i];
    return null;
  }

  registerForEvent(event: APICalendarEvent, onSuccess: Function, onError: Function): void {
    let part = configureParticipationForRegistrator(event);
    let url = "";
    this.http.post<string>(url, part).subscribe(
      (observer) => {
        onSuccess(observer);
      },
      (err: HttpErrorResponse) => {
        onError(err);
      }
    );
  }

  removeRegistraction(event: APICalendarEvent, onSuccess: Function, onError: Function) {
    let user = this.authService.getUser();
    let data = {
      calendarEventID: event.id,
      owner: user.email
    };
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      body: data,
    };
    let url = CombineUrls(apiUrl, "/Calendar/participations");
    this.http.delete(url, options).subscribe(
      (observer) => {
        onSuccess(observer);
      },
      (err: HttpErrorResponse) => {
        onError(err);
      }
    );
  }

  acceptInvitation(event: APICalendarEvent, onSuccess: Function, onError: Function) {
    let user = this.authService.getUser();
    let temp = this.registrations.find(x => x.hasOwnerConfirmed && !x.hasParticipantConfirmed && x.user == user.email && x.calendarEventId == event.id);
    if (temp == undefined) return;
    let url = "";
    this.http.post(url, temp.id).subscribe(
      (observer) => {
        onSuccess(observer);
      },
      (err: HttpErrorResponse) => {
        onError(err);
      }
    );
  }

}
