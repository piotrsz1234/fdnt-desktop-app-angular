import { Injectable } from '@angular/core';
import { APICalendarEvent, Participation, CategoryCalendarEvent } from '../calendar/calendarEvent';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private calendarEvents: APICalendarEvent[] = [];
  private registrationStatusForEvent: Participation[] = [];
  private eventCategories: CategoryCalendarEvent[] = [];

  constructor() { }

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

}
