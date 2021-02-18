import { Component, OnInit } from '@angular/core';
import { Task, TaskList, Declaration } from '../tasklist';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { CombineUrls, apiUrl, Count, GetUser } from 'src/app/config';
import { UserInfo } from 'src/app/login/user';

declare let showToast: Function;
declare let closeModal : Function;

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {

  constructor(private http : HttpClient) { }

  tasks : Task[] = [];
  taskList : TaskList = new TaskList();
  declarations : Declaration[] = [];

  currentlyInEdit: Task = new Task();

  ngOnInit(): void {
    console.log(localStorage.getItem("tasklist"));
    this.taskList = JSON.parse(localStorage.getItem("tasklist") as string) as TaskList;
    this.fetchTasks();
  }

  fetchTasks() : void {
    let params = new HttpParams().set("taskListID", this.taskList.id);
    this.http.get<Task[]>(CombineUrls(apiUrl, "TaskList/tasks"), {params})
    .subscribe((observer) => {
      this.tasks = observer;
    },
    (err : HttpErrorResponse) => {
      showToast("Coś poszło nie tak :(");
    });
  }

  fetchDeclarations(taskID : string) : void {
    let params = new HttpParams().set("taskId", taskID);
    this.http.get<Declaration[]>(CombineUrls(apiUrl, "TaskList/declarations"), {params})
      .subscribe((observer) => {
        this.declarations = observer;
      },
      (err : HttpErrorResponse) => {
        showToast("Coś poszło nie tak :(");
      });
  }

  getDateString(taskList : TaskList) : string {
    return new Date(taskList.deadline).toDateString();
  }

  setPercentage(id : number) : void {
    let temp = document.getElementById("progress"+id) as HTMLElement;
    let done = Count(this.declarations, (f : Declaration) => f.isComplete);
    temp.style.strokeDashoffset = "calc(220 - "+(Math.floor(done / this.declarations.length * 100))+"*220/100)";    
    (document.getElementById("progressT"+id) as HTMLElement).innerText = (Math.floor(done / this.declarations.length * 100)).toString();
  }

  doesPersonDeclared () : boolean {
    let user = GetUser() as UserInfo;
    return Count(this.declarations, (f : Declaration) => f.person == user.email) > 0;
  }

  doesPersonCompleted () : boolean {
    let user = GetUser() as UserInfo;
    return Count(this.declarations, (f : Declaration) => f.person == user.email && f.isComplete) > 0;
  }

  canUserBeAdded (task : Task) : boolean {
    return this.declarations.length < task.maximumCountOfPeopleWhoCanDoIt;
  }

  addTask(): void {
    this.http.post(CombineUrls(apiUrl, "TaskList/tasks"), this.currentlyInEdit)
      .subscribe((observer) => {
        showToast("Udało się dodać. Jej!");
        closeModal(0);
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
      });
  }

}
