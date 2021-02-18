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
    this.taskChange.emit();
  }

}
