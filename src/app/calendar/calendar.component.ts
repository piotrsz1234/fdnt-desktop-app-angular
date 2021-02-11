import { Component, OnInit } from '@angular/core';
import { DateAdapter, CalendarView, CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apiUrl } from '../config'
import { CombineUrls } from '../config'
import { User } from '../login/user'
import { APICalendarEvent, CategoryCalendarEvent } from './calendarEvent'

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
@Injectable()
export class CalendarComponent implements OnInit {

	view: CalendarView = CalendarView.Month;

	CalendarView = CalendarView;

	viewDate: Date = new Date();

	events: CalendarEvent[] = [];

	apisEvents: APICalendarEvent[] = [];

	categories: CategoryCalendarEvent[] = [];

	currentlyInEdit : APICalendarEvent = new APICalendarEvent();

	actions: CalendarEventAction[] = [
		{
			label: '<i class="fas fa-fw fa-pencil-alt"></i>',
			a11yLabel: 'Edit',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.editEvent(event);
			},
		},
		{
			label: '<i class="fas fa-fw fa-trash-alt"></i>',
			a11yLabel: 'Delete',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.removeEvent(event);
			},
		},
	];

	constructor(private http: HttpClient) {
	}

	ngOnInit(): void {
		this.fetchEvents();
		document.addEventListener('DOMContentLoaded', function () {
			var elems = document.querySelectorAll('.datepicker');
			var instances = M.Datepicker.init(elems, {});
			var elems = document.querySelectorAll('.modal');
			var instances = M.Modal.init(elems);
			var elems = document.querySelectorAll('.timepicker');
			var instances = M.Timepicker.init(elems);
		});
	}

	activateDamnThing(v: number): void {
		if (v == 0)
			setTimeout(this.fixOfDatePicker, 10);
		else setTimeout(this.fixOfTimePicker, 10);
	}

	fixOfDatePicker(): void {
		let temps = document.getElementsByClassName("modal datepicker-modal open");
		console.log(temps.length);
		if (temps != null && temps.length > 0) {
			let temp = temps.item(0);
			if (temp != null) (temp as HTMLElement).style.setProperty("height", "100%");
		}
	}

	fixOfTimePicker(): void {
		let temps = document.getElementsByClassName("modal timepicker-modal open");
		console.log(temps.length);
		if (temps != null && temps.length > 0) {
			let temp = temps.item(0);
			if (temp != null) (temp as HTMLElement).style.setProperty("height", "100%");
		}
	}

	fetchEvents(): void {
		let temp = localStorage.getItem("user");
		let user = new User();
		if (temp != null)
			user = JSON.parse(temp);
		else return;
		let params = new HttpParams().set("groups", user.groups.join("\n")).set("email", user.email)
		let tempEvents = this.http.get<APICalendarEvent[]>(CombineUrls(apiUrl, "/Calendar/events"), { params });
		tempEvents.subscribe((observer) => {
			this.apisEvents = observer;
			this.events = new Array<CalendarEvent>(observer.length);
			for (let i = 0; i < observer.length; i++) {
				this.events[i] = {
					start: observer[i].WhenBegins,
					end: observer[i].WhenEnds,
					title: observer[i].Name,
				};
			}
		});
	}

	fetchCategories() : void {
		let temp = localStorage.getItem("user");
		let user = new User();
		if (temp != null)
			user = JSON.parse(temp);
		else return;
		let params = new HttpParams().set("groups", user.groups.join("\n")).set("email", user.email)
		let observer = this.http.get<CategoryCalendarEvent[]>(CombineUrls(apiUrl, "/Calendar/categories"), { params });
		observer.subscribe((o) => {
			this.categories = o;
		}, (error) => {});
	}

	editEvent(event: CalendarEvent): void {
		let temp = this.apisEvents.find(x => (x.Name == event.title && x.WhenBegins == event.start && x.WhenEnds == event.end));
		if(temp != undefined)
			this.currentlyInEdit = temp;
	}


	removeEvent(event: CalendarEvent): void {

	}

}
