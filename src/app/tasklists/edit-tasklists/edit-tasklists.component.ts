import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { TaskList } from '../tasklist';
import { APICalendarEvent } from 'src/app/calendar/calendarEvent';
import { GetUser, CombineUrls, apiUrl, emptyGuid } from 'src/app/config';
import { UserInfo } from 'src/app/login/user';
import { HttpClient, HttpParams } from '@angular/common/http';

declare let setDate: Function;
declare let showToast: Function;
declare let setMinimumDateForDatePicker: Function;

@Component({
  selector: 'app-edit-tasklists',
  templateUrl: './edit-tasklists.component.html',
  styleUrls: ['./edit-tasklists.component.css']
})
export class EditTasklistsComponent implements OnInit {

  @Input()
  title: string = "";
  @Input()
  taskList: TaskList = new TaskList(true);
  events: APICalendarEvent[] = [];
  options: string[] = [];
  ids: number[] = [];
  @Output()
  taskListChange: EventEmitter<TaskList> = new EventEmitter<TaskList>();

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    if (this.taskList.id != emptyGuid)
      setDate(this.taskList.deadline, "date");
    this.fetchEvents();
    setMinimumDateForDatePicker();
  }

  inputChanged() {
    this.taskList.name = (document.getElementById("name") as HTMLInputElement).value;
    this.onChange();
  }

  fetchEvents(): void {
    let user = GetUser() as UserInfo;
    let params = new HttpParams().set("groups", user.groups.join('\n')).set("email", user.email);
    this.http.get<APICalendarEvent[]>(CombineUrls(apiUrl, "/Calendar/events"), { params })
      .subscribe((observer) => {
        this.events = observer;
        this.options = [];
        this.options.push("Osobista");
        for (let k of observer) {
          if (k.creatorEmail == user.email) {
            this.options.push("Wydarzenie: " + k.name);
            this.ids.push(observer.indexOf(k));
          }
        }
      }, (err) => {
          showToast("Coś poszło nie tak, podczas przygotowywania opcji właściciela :(");
    })
  }

  onChange(): void {
    this.taskListChange.emit(this.taskList);
  }

  activatePicker(): void {
		setTimeout(this.fixPicker, 10, 'datepicker-modal');
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

  dateChanged() : void {
    let input = document.getElementById("date") as HTMLInputElement;
    this.taskList.deadline = (JSON.stringify(new Date(input.value)) as string).replace("\"", "").replace("\"", "");
    this.onChange();
  }

  selectChange() : void {
    let input = document.getElementById("owner") as HTMLSelectElement;
    let value = +input.value;
    if (value > 0)
      this.taskList.owner = this.events[this.ids[+value - 1]].id;
    else this.taskList.owner = (GetUser() as UserInfo).email;
    this.onChange();
  }

  isSelected(option: string): boolean {
    if (option == this.options[0] && this.taskList.owner == (GetUser() as UserInfo).email) return true;
    if(this.options.indexOf(option) > 0)
      if (this.taskList.owner == this.events[this.ids[this.options.indexOf(option) - 1]].id) return true;
    return false;
  }

}
