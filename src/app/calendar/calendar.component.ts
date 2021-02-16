import { Component, OnInit } from '@angular/core';
import { DateAdapter, CalendarView, CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apiUrl, emptyGuid } from '../config'
import { CombineUrls } from '../config'
import { UserInfo } from '../login/user'
import { APICalendarEvent, CategoryCalendarEvent } from './calendarEvent'
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { TaskList } from '../tasklists/tasklist';
import { ObjectUnsubscribedError } from 'rxjs';

declare var openModal : Function;
declare var setDate : Function;
declare var setTime : Function;
declare var selectValues : Function;
declare var showToast : Function;

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
@Injectable()
export class CalendarComponent implements OnInit {

	colors: any = {
		red: {
		  primary: '#ad2121',
		  secondary: '#FAE3E3',
		},
		blue: {
		  primary: '#1e90ff',
		  secondary: '#D1E8FF',
		},
		yellow: {
		  primary: '#e3bc08',
		  secondary: '#FDF1BA',
		},
	  };

	view: CalendarView = CalendarView.Month;

	CalendarView = CalendarView;

	viewDate: Date = new Date();

	events: CalendarEvent[] = [];

	apisEvents: APICalendarEvent[] = [];

	taskLists : TaskList[] = [];

	categories: CategoryCalendarEvent[] = [];

	currentlyInEdit : APICalendarEvent = new APICalendarEvent();

	activeDayIsOpen : boolean = false;

	actions: CalendarEventAction[] = [
		{
			label: '<i class="material-icons tiny">edit</i>',
			a11yLabel: 'Edit',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				openModal(0);
				this.editEvent(event);
			},
		},
		{
			label: '<i class="material-icons tiny">delete</i>',
			a11yLabel: 'Delete',
			onClick: ({ event }: { event: CalendarEvent }): void => {
				this.removeEvent(event);
			},
		},
	];

	editModalHeader: string = "Edytuj wydarzenie";
	editModalButtonText: string = "Zapisz zmiany";

	tabs:string[] = [];

	constructor(private http: HttpClient) {
	}

	ngOnInit(): void {
		this.fetchEvents();
		this.fetchCategories();
		this.fetchTaskLists();
		let json = localStorage.getItem("tabs");
		if(json == null) return;
		let temp = JSON.parse(json);
		if(temp != null) this.tabs = temp;
	}

	activateDamnThing(v: string): void {
		setTimeout(this.fixPicker, 10, v);
	}

	fixPicker(name : string): void {
		let temps = document.getElementsByClassName("modal "+name+" open");
		if (temps != null && temps.length > 0) {
			let temp = temps.item(0);
			if (temp != null) 
			{
				(temp as HTMLElement).style.setProperty("height", "100%");
				(temp as HTMLElement).style.setProperty("width", "100%");
			}
		}
	}


	fetchEvents(): void {
		let temp = localStorage.getItem("user");
		let user = new UserInfo();
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
					start: new Date(observer[i].whenBegins),
					end: new Date(observer[i].whenEnds),
					title: observer[i].name,
					color: this.colors.red,
					actions: this.actions,
        			draggable: true,
				};
			}
		});
	}

	fetchCategories() : void {
		let temp = localStorage.getItem("user");
		let user = new UserInfo();
		if (temp != null)
			user = JSON.parse(temp);
		else return;
		let params = new HttpParams().set("groups", user.groups.join("\n")).set("email", user.email)
		let observer = this.http.get<CategoryCalendarEvent[]>(CombineUrls(apiUrl, "/Calendar/categories"), { params });
		observer.subscribe((o) => {
			this.categories = o;
		}, (error) => {});
	}

	fetchTaskLists() : void {
		let temp = localStorage.getItem("user");
		let user = new UserInfo();
		if (temp != null)
			user = JSON.parse(temp);
		else return;
		let params = new HttpParams().set("owner", user.email)
		let tempEvents = this.http.get<TaskList[]>(CombineUrls(apiUrl, "/TaskList/tasklists"), { params });
		tempEvents.subscribe((observer) => {
			this.taskLists = [];
			this.taskLists.push(new TaskList());
			for(let i=0;i<observer.length;i++)
				this.taskLists.push(observer[i]);
		});
	}

	editEvent(event: CalendarEvent): void {
		let temp = this.apisEvents.find(x => (x.name == event.title));
		this.editModalHeader = "Edytuj wydarzenie";
		this.editModalButtonText = "Zapisz zmiany";
		if(temp != undefined)
			this.currentlyInEdit = temp;
		
		setDate(this.currentlyInEdit.whenBegins, 0);
		setTime(this.currentlyInEdit.whenBegins, 0);
		setDate(this.currentlyInEdit.whenEnds, 1);
		setTime(this.currentlyInEdit.whenEnds, 1);
	}


	removeEvent(event: CalendarEvent): void {

	}

	dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
		if (isSameMonth(date, this.viewDate)) {
		  if (
			(isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
			events.length === 0
		  ) {
			this.activeDayIsOpen = false;
		  } else {
			this.activeDayIsOpen = true;
		  }
		  this.viewDate = date;
		}
	}

	addEvent() : void {
		this.currentlyInEdit = new APICalendarEvent();
		this.editModalHeader = "Dodaj wydarzenie";
		this.editModalButtonText = "Dodaj";
	}

	save() : void {
		var select = document.getElementById("groups") as HTMLSelectElement;
		var category = document.getElementById("category") as HTMLSelectElement;
		var taskList = document.getElementById("tasklist") as HTMLSelectElement;
		if(category == null || taskList == null) return;
		let t = selectValues(select) as string[];
		let forWho = "";
		for(let k in t) {
			forWho += this.tabs[(+k as number)] + "\n";
		}
		this.currentlyInEdit.forWho = forWho;
		this.currentlyInEdit.category = this.categories[+category.value].iD;
		this.currentlyInEdit.taskListID = this.taskLists[+taskList.value].iD;
		console.log(JSON.stringify(this.currentlyInEdit));
		let userJson = localStorage.getItem("user");
		if(userJson == null) return;
		let user = JSON.parse(userJson) as UserInfo;
		if(user == undefined) return;
		this.currentlyInEdit.creatorEmail = user.email;
		if(this.currentlyInEdit.id == emptyGuid) {
			this.http.post<string>(CombineUrls(apiUrl, "Calendar/events"), this.currentlyInEdit)
			.subscribe(x => {
				showToast("Udało się dodać wydarzenie. Jej!");
			},
			(error) =>{
				
			})
		}else {

		}
	}


}
