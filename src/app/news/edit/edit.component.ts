import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Post } from '../post';
import { AngularEditorConfig } from '@kolkov/angular-editor';

declare let selectValues : Function;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  @Input()
  title: string = ""; 
  @Input()
  post: Post = new Post();
  @Input()
  tabs : string[] = [];
  @Output()
  postChange = new EventEmitter<Post>();
  @Input()
  isEdit : boolean=false;

  constructor() { }

  ngOnInit(): void {
    this.postChange.subscribe((x : Post) => console.log("Test"));
    let temp = this.post.forWho.split('\n');
    temp.pop();
    if(this.isEdit)
      this.setGroups(temp);
  }
  
  getGroups() : void {
    let select = document.getElementById("groups") as HTMLElement;
    let values = selectValues(select) as string[];
    for(let k in values)
    {
      this.post.forWho += this.tabs[(+k as number)] + "\n";
    }
  }

  setGroups (array:string[]) {
		let children = document.getElementsByClassName("dropdown-content select-dropdown multiple-select-dropdown")[0].childNodes;
		for(let i=0;i<children.length;i++)
		{
		  for(let j=0;j<array.length;j++) {
			
			if((children[i] as HTMLElement).innerHTML.includes(array[j]))
			  (children[i].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).click();
		  }
		}
	}
  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '22rem',
    minHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

  changedData() : void {
    this.post.title = (document.getElementById("title") as HTMLInputElement).value;
    this.getGroups();
    this.postChange.emit(this.post);
  }
}
