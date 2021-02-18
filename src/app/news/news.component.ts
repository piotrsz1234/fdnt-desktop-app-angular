import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Post } from './post';
import { CombineUrls, apiUrl, GetUser, emptyGuid } from '../config';
import { UserInfo } from '../login/user';
import { AngularEditorConfig } from '@kolkov/angular-editor';

declare let openModal : Function;
declare let showToast : Function;
declare let closeModal : Function;
declare let selectValues : Function;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})

@Injectable()
export class NewsComponent implements OnInit {

  constructor(public http : HttpClient) { }

  posts : Post[] = [];

  tabs : string[] = [];

  currentlyInEdit : Post = new Post();

  log (v : any) {
    console.log(v);
  }

  ngOnInit(): void {
    this.fetchPosts();
    this.tabs = JSON.parse(localStorage.getItem("tabs") as string) as string[];
  }

  fetchPosts() : void {
    let userJson = localStorage.getItem("user") as string;
    let user = JSON.parse(userJson) as UserInfo;
    let params = new HttpParams().set("email", user.email).set("groups", user.groups.join("\n"))
    .set("howMany", "10").set("fromWhere", "0");
    this.http.get<Post[]>(CombineUrls(apiUrl, "Post/posts"), {params, responseType: 'json'})
      .subscribe(x => {
        this.posts = x;
      });
  }

  getCoverImage(html : string) : string {
    let t = html.indexOf('data:image/');
    if(t == undefined) return "";
    return html.substr(t, html.indexOf("\"", t) - t);
  }
  
  setStyle(item : Post) {
    (document.getElementById('post'+this.posts.indexOf(item)) as HTMLElement)
      .style.backgroundImage = "url("+this.getCoverImage(item.html)+")";
  } 

  addPost(publish : boolean) : void {
    let user = GetUser() as UserInfo;
    this.currentlyInEdit.isPublished = publish;
    this.currentlyInEdit.owner = user.email;
    this.currentlyInEdit.publishDate = JSON.stringify(new Date());
    if(this.currentlyInEdit.iD == emptyGuid)
      this.http.post(CombineUrls(apiUrl, "Post/posts"), this.currentlyInEdit)
        .subscribe(x => {
          this.fetchPosts();
          showToast("Udało się "+((publish)?"opublikować":"dodać")+" posta!");
          closeModal(0);
        },
        (err : HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
        });
    else this.http.post(CombineUrls(apiUrl, "Post/posts/publish"), this.currentlyInEdit)
    .subscribe(x => {
      showToast("Udało się opublikować zmiany!");
      closeModal(0);
    },
    (err : HttpErrorResponse) => {
      showToast("Coś poszło nie tak :(");
    });
  }
}
