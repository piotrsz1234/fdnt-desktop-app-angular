import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Post } from '../post';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { GetUser, emptyGuid, CombineUrls, apiUrl } from 'src/app/config';
import { UserInfo } from 'src/app/login/user';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

declare let selectValues: Function;
declare let showToast: Function;
declare let closeModalById: Function;
declare let getEventsValue: Function;

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnChanges {

  @Input()
  id: string = "";
  @Input()
  title: string = "";
  @Input()
  public post: Post = new Post();
  @Input()
  tabs: string[] = [];
  @Input()
  isEdit: boolean = false;
  @Output()
  requestSuccessed = new EventEmitter();

  constructor(private http: HttpClient) { }

  titleChanged(t : Event): void {
    this.post.title = getEventsValue(t);
  }

  getGroups(): void {
    let select = document.getElementById("groups") as HTMLElement;
    let values = selectValues(select) as string[];
    for (let k in values) {
      this.post.forWho += this.tabs[(+k as number)] + "\n";
    }
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges)  {
    let temp = this.post.forWho.split('\n');
    let list = document.getElementsByName("title");
    for (let i = 0; i < list.length;i++)
      (list[i] as HTMLInputElement).value = this.post.title;
    temp.pop();
    if (this.isEdit)
      this.setGroups(temp);
  }

  setGroups(array: string[]) {
    let temp = document.getElementsByClassName("dropdown-content select-dropdown multiple-select-dropdown");
    for (let i = 0; i < temp.length; i++) {
      if (temp[i] == undefined) continue;
      let children = temp[i].childNodes;
      for (let i = 0; i < children.length; i++) {
        for (let j = 0; j < array.length; j++) {

          if ((children[i] as HTMLElement).innerHTML.includes(array[j]))
            (children[i].childNodes[0].childNodes[0].childNodes[0] as HTMLElement).click();
        }
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

  changedData(): void {
    this.post.title = (document.getElementById("title") as HTMLInputElement).value;
    this.getGroups();
  }

  addPost(publish: boolean): void {
    let user = GetUser() as UserInfo;
    this.post.isPublished = publish;
    this.post.owner = user.email;
    this.post.publishTime = JSON.stringify(new Date());
    if (this.post.id == emptyGuid)
      this.http.post(CombineUrls(apiUrl, "Post/posts"), this.post)
        .subscribe(x => {
          showToast("Udało się " + ((publish) ? "opublikować" : "dodać") + " posta!");
          closeModalById('edit-post');
          this.requestSuccessed.emit();
          this.post = new Post();
        },
          (err: HttpErrorResponse) => {
            showToast("Coś poszło nie tak :(");
          });
    else this.http.post(CombineUrls(apiUrl, "Post/posts" + ((publish) ? "/publish" : "")), this.post)
      .subscribe(x => {
        showToast("Udało się opublikować zmiany!");
        this.post = new Post();
        this.requestSuccessed.emit();
        closeModalById('edit-post');
      },
        (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
        });
  }

}
