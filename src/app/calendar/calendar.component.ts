import { Component, OnInit } from '@angular/core';
import { DateAdapter, CalendarView, CalendarEvent, CalendarEventAction } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { apiUrl, emptyGuid } from '../config'
import { CombineUrls } from '../config'
import { UserInfo } from '../login/user'
import { APICalendarEvent, CategoryCalendarEvent, CalculateColorForHex, CalculateSecondaryColorForHex, AreTheyTheSame } from './calendarEvent'
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { TaskList } from '../tasklists/tasklist';

declare let openModal : Function;
declare let setDate : Function;
declare let setTime : Function;
declare let selectValues : Function;
declare let showToast : Function;
declare let closeModal : Function;
declare let setValues : Function;

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.css']
})
@Injectable()
export class CalendarComponent implements OnInit {

	view: CalendarView = CalendarView.Month;

	CalendarView = CalendarView;

	selectedTabs : string[] = [];

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

	async ngOnInit() {
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

	setCategory(id:string) {
		let params = new HttpParams().set("categoryId", id);
		let o = new CategoryCalendarEvent();
		let output = this.http.get<CategoryCalendarEvent>(CombineUrls(apiUrl, "/Calendar/category"), {params});
		output.subscribe(x => {
			for(let i=0;i<this.events.length;i++)
				if(this.apisEvents[i].category == x.id)
					this.events[i].color = { 
						primary: CalculateColorForHex(x.color),
						secondary: CalculateSecondaryColorForHex(x.color)
					};
		});	
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
					color:{ 
						primary: "",
						secondary: ""
					},
					actions: this.actions,
        			draggable: true,
				};
				this.setCategory(this.apisEvents[i].category);
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
		let temp = this.apisEvents.find(x => AreTheyTheSame(x, event));
		console.log(temp);
		this.editModalHeader = "Edytuj wydarzenie";
		this.editModalButtonText = "Zapisz zmiany";
		if(temp != undefined)
			this.currentlyInEdit = temp;
		setDate(this.currentlyInEdit.whenBegins, 0);
		setTime(this.currentlyInEdit.whenBegins, 0);
		setDate(this.currentlyInEdit.whenEnds, 1);
		setTime(this.currentlyInEdit.whenEnds, 1);
		let selected = this.currentlyInEdit.forWho.split('\n');
		if(selected[selected.length-1] == "") selected.pop();
		this.setValuesInSelect(selected);
	}

	setValuesInSelect(array:string[]) {
		let children = document.getElementsByClassName("dropdown-content select-dropdown multiple-select-dropdown")[0].childNodes;
		for(let i=0;i<children.length;i++)
		{
		  for(let j=0;j<array.length;j++) {
			
			if((children[i] as HTMLElement).innerHTML.includes(array[j]))
			  (children[i].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).click();
		  }
		}
	}

	replace(inWHat:string, what:string, forWhat:string) : string {
		let output = "";
		for(let i=0;i<inWHat.length - what.length;i++) {
			if(inWHat.substr(i, what.length) == what)
			{
					output += forWhat;
					i+=what.length-1;
			} else output += inWHat[i];
		}
		return output;
	}

	removeEvent(event: CalendarEvent): void {
		let temp = this.apisEvents.find(x => AreTheyTheSame(x, event));
		 this.currentlyInEdit = temp as APICalendarEvent;
		openModal(-1);
	}

	indexOfTaskList(array : Array<TaskList>, id : string) : number {
		for(let i =0;i<array.length;i++)
			if(array[i].id == id) return i;
		return -1;
	}

	indexOfCategory(array : Array<CategoryCalendarEvent>, id : string) : number {
		for(let i =0;i<array.length;i++)
			if(array[i].id == id) return i;
		return -1;
	}

	deleteEvent() : void {
		let json = localStorage.getItem("user") as string;
		let info = JSON.parse(json) as UserInfo;
		let data = {
			"calendarEventID" : this.currentlyInEdit.id,
			"owner" : info.email
		}
		const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: data,
		  };
		this.http.delete(CombineUrls(apiUrl, "/Calendar/events"), options)
		.subscribe(x => {
			showToast("Udalo się usunac");
			this.fetchEvents();
		},
		(err : HttpErrorResponse) => {
			if(err.status == 403)
				showToast("Nie masz uprawnień, aby go usunać!");
			else showToast("Z jakiegoś powodu nie możesz usunać!")
		});
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

	getDates() : void {
		let bDate = document.getElementById("begin-date") as HTMLInputElement;
		let bTime = document.getElementById("begin-time") as HTMLInputElement;
		let eDate = document.getElementById("end-date") as HTMLInputElement;
		let eTime = document.getElementById("end-time") as HTMLInputElement;
		let bOutputDate = new Date(bDate.value + " " + bTime.value);
		let eOutputDate = new Date(eDate.value + " " + eTime.value);
		let bS = JSON.stringify(bOutputDate);
		this.currentlyInEdit.whenBegins = bS.substr(1, bS.length-2);
		let eS = JSON.stringify(eOutputDate);
		this.currentlyInEdit.whenEnds = eS.substr(1, eS.length-2);
	}

	readDataFromInputs() : void {
		this.getDates();
		let select = document.getElementById("groups") as HTMLSelectElement;
		let category = document.getElementById("category") as HTMLSelectElement;
		let taskList = document.getElementById("tasklist") as HTMLSelectElement;
		if(category == null || taskList == null) return;
		let t = selectValues(select) as string[];
		let forWho = "";
		for(let k in t) {
			forWho += this.tabs[(+k as number)] + "\n";
		}
		this.currentlyInEdit.forWho = forWho;
		this.currentlyInEdit.category = this.categories[+category.value].id;
		this.currentlyInEdit.taskListID = this.taskLists[+taskList.value].id;
		console.log(JSON.stringify(this.currentlyInEdit));
		let userJson = localStorage.getItem("user");
		if(userJson == null) return;
		let user = JSON.parse(userJson) as UserInfo;
		if(user == null) return;
		this.currentlyInEdit.creatorEmail = user.email;
		this.currentlyInEdit.name = (document.getElementById("event-name") as HTMLInputElement).value;
		this.currentlyInEdit.location = (document.getElementById("event-location") as HTMLInputElement).value;
	}

	save() : void {
		this.readDataFromInputs();
		if(this.currentlyInEdit.id == emptyGuid) {
			this.http.post<string>(CombineUrls(apiUrl, "Calendar/events"), this.currentlyInEdit)
			.subscribe(x => {
				showToast("Udało się dodać wydarzenie. Jej!");
				closeModal(0);
				this.fetchEvents();
			},
			(error) =>{
				console.log(error);
				showToast("Nie udało się dodać!");
			})
		}else {
			this.http.patch<string>(CombineUrls(apiUrl, "Calendar/events"), this.currentlyInEdit)
			.subscribe(x => {
				showToast("Udało się zedytować wydarzenie. Jej!");
				closeModal(0);
				this.fetchEvents();
			},
			(error) =>{
				console.log(error);
				showToast("Nie udało się dodać!");
			})
		}
	}

	changeMonth(t : number) : void {
		this.viewDate.setMonth(this.viewDate.getMonth() + t);
	}

	closeOpenMonthViewDay() {
		this.activeDayIsOpen = false;
	}

}
