import { Component, OnInit } from '@angular/core';
import { Task, TaskList, Declaration } from '../tasklist';
import { HttpClient, HttpParams, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { CombineUrls, apiUrl, Count, GetUser, getDateString, RemoveWhere, FirstOrDefault, Where, emptyGuid } from 'src/app/config';
import { UserInfo } from 'src/app/login/user';
import { Router } from '@angular/router';

declare let showToast: Function;
declare let closeModal: Function;
declare let loadMaterializeCss: Function;

@Component({
  selector: 'app-tasklist',
  templateUrl: './tasklist.component.html',
  styleUrls: ['./tasklist.component.css']
})
export class TasklistComponent implements OnInit {

  constructor(private http: HttpClient, private router : Router) { }

  tasks: Task[] = [];
  taskList: TaskList = new TaskList();
  declarations: Declaration[] = [];

  currentlyInEdit: Task = new Task();

  ngOnInit(): void {
    loadMaterializeCss();
    console.log(localStorage.getItem("tasklist"));
    this.taskList = JSON.parse(localStorage.getItem("tasklist") as string) as TaskList;
    if (this.taskList == null)
      this.router.navigateByUrl("(main:tasklists)");
    localStorage.removeItem("tasklist");
    this.fetchTasks();
  }

  fetchTasks(): void {
    let params = new HttpParams().set("taskListID", this.taskList.id);
    this.http.get<Task[]>(CombineUrls(apiUrl, "TaskList/tasks"), { params })
      .subscribe((observer) => {
        this.tasks = observer;
        for (let k of observer)
          this.fetchDeclarations(k.id);
      },
        (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
        });
  }

  fetchDeclarations(taskID: string): void {
    let params = new HttpParams().set("taskId", taskID);
    this.http.get<Declaration[]>(CombineUrls(apiUrl, "TaskList/declarations"), { params })
      .subscribe((observer) => {
        this.declarations = RemoveWhere(this.declarations, (f: Declaration) => f.task == taskID);
        for (let k of observer)
          this.declarations.push(k);
      },
        (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
        });
  }

  getDateString(taskList: TaskList): string {
    return new Date(taskList.deadline).toDateString();
  }

  formatDateString(tasklist: TaskList): string {
    return getDateString(new Date(tasklist.deadline));
  }

  getPercentage(id: number): number {
    let temp = document.getElementById("progress" + id) as HTMLElement;
    let done = Count(this.declarations, (f: Declaration) => f.isCompleted && f.task == this.tasks[id].id);
    let all = Count(this.declarations, (f: Declaration) => f.task == this.tasks[id].id);
    if (all > 0) {
      temp.style.strokeDashoffset = "calc(220 - " + (Math.floor(done / all * 100)) + "*220/100)";
      return (Math.floor(done / all * 100));
    } else {
      temp.style.strokeDashoffset = "calc(220 - " + 0 + "*220/100)";
      return 0;
    }
  }

  setPercentage(id: number): void {
    (document.getElementById("progressT" + id) as HTMLElement).innerText = this.getPercentage(id).toString();
  }

  doesPersonDeclared(task : Task): boolean {
    let user = GetUser() as UserInfo;
    return Count(this.declarations, (f: Declaration) => f.person == user.email && task.id == f.task) > 0;
  }

  getDeclarations(task: Task): Array<Declaration> {
    return Where(this.declarations, (f: Declaration) => f.task == task.id);
  }

  doesPersonCompleted(t : Task): boolean {
    let user = GetUser() as UserInfo;
    return Count(this.declarations, (f: Declaration) =>f.task == t.id && f.person == user.email && f.isCompleted) > 0;
  }

  canUserBeAdded(task: Task): boolean {
    let user = GetUser() as UserInfo;
    return Count(this.declarations, (f: Declaration) =>f.task == task.id && f.person == user.email) < task.maximumCountOfPeopleWhoCanDoIt;
  }

  createDeclaration(user : UserInfo, id : number) : Declaration {
    let declaration = new Declaration();
    declaration.task = this.tasks[id].id;
    declaration.person = user.email;
    declaration.isCompleted = false;
    return declaration;
  }

  addDeclaration(id: number): void {
    let user = GetUser() as UserInfo;
    let declaration = this.createDeclaration(user, id);
    this.http.post(CombineUrls(apiUrl, "TaskList/declarations"), declaration)
      .subscribe(x => {
        showToast("Udało się dodać twoją deklarację");
        this.fetchDeclarations(this.tasks[id].id);
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
    })
  }

  addTask(): void {
    this.currentlyInEdit.ownerId = this.taskList.id;
    console.log(JSON.stringify(this.currentlyInEdit));
    this.http.post(CombineUrls(apiUrl, "TaskList/tasks"), this.currentlyInEdit)
      .subscribe((observer) => {
        showToast("Udało się dodać. Jej!");
        closeModal(0);
        this.currentlyInEdit = new Task();
        this.fetchTasks();
      }, (err: HttpErrorResponse) => {
        showToast("Coś poszło nie tak :(");
      });
  }

  emailToFancyName(email: string): string {
    email = email.substr(0, email.indexOf('@'));
    email = email.substr(0, 1).toUpperCase() + email.substr(1);
    let index = email.indexOf('.') + 1;
    email = email.substr(0, index) + email.substr(index, 1).toUpperCase() + email.substr(index + 1);
    email = email.replace('.', ' ');
    return email;
  }

  completeOwnPart(id: number): void {
    let user = GetUser() as UserInfo;
    let dec = FirstOrDefault(this.declarations, (x: Declaration) => x.task == this.tasks[id].id && x.person == user.email);
    if (dec == undefined) return;
    this.http.patch(CombineUrls(apiUrl, "/TaskList/declarations"), dec)
      .subscribe(() => {
        showToast("Udało się przesłać informacje");
        this.fetchDeclarations(this.tasks[id].id);
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
    })
  }

  isCurrentlyEditing() {
    return !(this.currentlyInEdit.id == emptyGuid || this.currentlyInEdit.id == "");
  }

  editTask(task: Task) {
    this.currentlyInEdit = task;
  }

  saveChanges() {
    this.http.patch(CombineUrls(apiUrl, "TaskList/tasks"), this.currentlyInEdit)
      .subscribe(() => {
        showToast("Udało się zedytować");
        this.fetchTasks();
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(")
    })
  }

  discardChanges() {
    this.currentlyInEdit = new Task();
  }

  removeTask(task: Task) {
    console.log("asdasd");
    let data = {
      taskId: task.id,
      owner: (GetUser() as UserInfo).email
    }
    let options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: data
    };
    this.http.delete(CombineUrls(apiUrl, "TaskList/tasks"), options)
      .subscribe(() => {
        console.log("Co się odchrzania?")
        showToast("Udało się usunąć");
        this.fetchTasks();
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
      });
  }

}
