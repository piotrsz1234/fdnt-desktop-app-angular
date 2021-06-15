import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { APICalendarEvent, CategoryCalendarEvent } from '../calendarEvent';
import { TaskList } from 'src/app/tasklists/tasklist';
import { emptyGuid } from 'src/app/config';

declare let loadMaterializeCss: Function;
declare let closeModalById: Function;
declare let selectValues: Function;

@Component({
  selector: 'app-edit-event',
  templateUrl: './edit-event.component.html',
  styleUrls: ['./edit-event.component.css']
})
export class EditEventComponent implements OnInit, OnChanges {

  @Input()
  currentlyInEdit: APICalendarEvent = new APICalendarEvent();

  @Input()
  taskLists: TaskList[] = [];

  @Input()
  categories: CategoryCalendarEvent[] = [];

  @Output()
  currentlyInEditChange: EventEmitter<APICalendarEvent> = new EventEmitter<APICalendarEvent>();

  tabs: string[] = [];

  editModalHeader: string = "Edytuj wydarzenie";
  editModalButtonText: string = "Zapisz zmiany";

  constructor() { }

  ngOnInit(): void {
    loadMaterializeCss();
    
    this.tabs = JSON.parse(localStorage.getItem("tabs") as string) as string[];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.editModalHeader = (this.currentlyInEdit.id == emptyGuid) ? "Dodaj wydarzenie" : "Edytuj wydarzenie";
    this.editModalButtonText = (this.currentlyInEdit.id == emptyGuid) ? "Dodaj" : "Zapisz zmiany";
    if (this.currentlyInEdit.id != emptyGuid) {
      let selected = this.currentlyInEdit.forWho.split('\n');
      if (selected[selected.length - 1] == "") selected.pop();
      this.setValuesInSelect(selected);
    }
  }

  activateDamnThing(v: string): void {
    setTimeout(this.fixPicker, 10, v);
  }

  fixPicker(name: string): void {
    let temps = document.getElementsByClassName("modal " + name + " open");
    if (temps != null && temps.length > 0) {
      let temp = temps.item(0);
      if (temp != null) {
        (temp as HTMLElement).style.setProperty("height", "100%");
        (temp as HTMLElement).style.setProperty("width", "100%");
      }
    }
  }

  indexOfTaskList(array: Array<TaskList>, id: string): number {
    for (let i = 0; i < array.length; i++)
      if (array[i].id == id) return i;
    return -1;
  }

  indexOfCategory(array: Array<CategoryCalendarEvent>, id: string): number {
    for (let i = 0; i < array.length; i++)
      if (array[i].id == id) return i;
    return -1;
  }

  setValuesInSelect(array: string[]) {
    let children = document.getElementsByClassName("dropdown-content select-dropdown multiple-select-dropdown")[0].childNodes;
    for (let i = 0; i < children.length; i++) {
      for (let j = 0; j < array.length; j++) {
        var test = (children[i].childNodes[0].childNodes[0].childNodes[0] as HTMLInputElement);
        if ((children[i] as HTMLElement).innerHTML.includes(array[j]) && !test.checked)
          test.click();
        if ((children[i] as HTMLElement).innerHTML.includes(array[j]) == false && test.checked)
          test.click();
      }
    }
  }

  save(): void {
    let temp = selectValues(document.getElementById("groups")) as Array<string>;
    temp.forEach(element => {
      this.currentlyInEdit.forWho += this.tabs[parseInt(element)] + "\n"; 
    });
    this.currentlyInEditChange.emit(this.currentlyInEdit);
    console.log(this.currentlyInEdit);
  }

}
