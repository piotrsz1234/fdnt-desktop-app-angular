import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../../tasklist';

@Component({
  selector: 'app-edit-tasklist',
  templateUrl: './edit-tasklist.component.html',
  styleUrls: ['./edit-tasklist.component.css']
})
export class EditTasklistComponent implements OnInit {

  constructor() { }

  @Input()
  task: Task = new Task();

  @Output()
  taskChange : EventEmitter<Task> = new EventEmitter<Task>();
    
  ngOnInit(): void {
  }

  onChange(): void {
    this.task.title = (document.getElementById("title") as HTMLInputElement).value;
    this.task.text = (document.getElementById("text") as HTMLInputElement).value as string;
    this.task.maximumCountOfPeopleWhoCanDoIt = +(document.getElementById("max") as HTMLSelectElement).value;
    this.taskChange.emit(this.task);
  }

}
