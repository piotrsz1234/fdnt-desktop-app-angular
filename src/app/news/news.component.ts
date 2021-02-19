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

  isInEditionMode: boolean = false;

  startIndex: number = 0;

  changeOfMode() {
    this.isInEditionMode = (document.getElementById("edit") as HTMLInputElement).checked;
  }

  nextPage() {
    this.startIndex += 10;
    this.fetchPosts();
  }

  previousPage() {
    this.startIndex -= 10;
    if (this.startIndex < 0) this.startIndex = 10;
    this.fetchPosts();
  }

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
    .set("howMany", "5").set("fromWhere", this.startIndex.toString());
    this.http.get<Post[]>(CombineUrls(apiUrl, "Post/posts"), {params, responseType: 'json'})
      .subscribe(x => {
        this.posts = x;
      });
  }

  change() {
    this.fetchPosts();
  }

}
