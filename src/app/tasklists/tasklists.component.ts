import { Component, OnInit } from '@angular/core';
import { TaskList } from './tasklist';
import { CombineUrls, apiUrl, GetUser, getDateString } from '../config';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UserInfo } from '../login/user';
import { Observable } from 'rxjs';

declare let showToast: Function;
declare let closeModal : Function

@Component({
  selector: 'app-tasklists',
  templateUrl: './tasklists.component.html',
  styleUrls: ['./tasklists.component.css']
})
export class TasklistsComponent implements OnInit {

  taskLists : TaskList[] = [];

  currentlyInEdit: TaskList = new TaskList();
  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.currentlyInEdit.name = "";
    this.fetchTaskLists();
  }

  fetchTaskLists(): void {
    let user = (GetUser() as UserInfo);
    let params = new HttpParams().set("owner", user.email);
    this.http.get<TaskList[]>(CombineUrls(apiUrl, "TaskList/tasklists"), { params })
      .subscribe((observer) => {
        console.log(observer);
        this.taskLists = observer;
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
    })
  }

  goToChild(id : number) {
    localStorage.setItem("tasklist", JSON.stringify(this.taskLists[id]));
  }

  formatDateString(tasklist: TaskList) : string {
    return getDateString(new Date(tasklist.deadline));
  }

  addTaskList(): void {
    console.log(this.currentlyInEdit);
    let temp = this.currentlyInEdit.owner;
    this.currentlyInEdit.owner = (GetUser() as UserInfo).email;
    this.http.post<string>(CombineUrls(apiUrl, "TaskList/tasklists"), this.currentlyInEdit)
      .subscribe((observer : string) => {
        showToast("Udało się dodać. Jej!");
        closeModal(0);
        if (temp != this.currentlyInEdit.owner) {
          this.updateCalendarEvent(temp, observer);
        }
      }, (err: HttpErrorResponse) => {
          if (err.status == 422) showToast("Któreś pole jest puste!");
          else
            showToast("Coś poszło nie tak :(");
        });
    
  }

  updateCalendarEvent(eventID : string, taskListId : string) {
    let data = {
      eventID : eventID,
      taskListId : taskListId
    };
    this.http.post(CombineUrls(apiUrl, "TaskList/tasklists/event"), data);
  }

}
