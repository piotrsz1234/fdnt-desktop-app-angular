import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Post } from './post';
import { CombineUrls, apiUrl } from '../config';
import { UserInfo } from '../login/user';
import { ToolbarService, LinkService, ImageService, HtmlEditorService } from '@syncfusion/ej2-angular-richtexteditor';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService]
})

@Injectable()
export class NewsComponent implements OnInit {

  constructor(public http : HttpClient) { }

  posts : Post[] = [];

  ngOnInit(): void {
    this.fetchPosts();
    console.log(this.posts);
  }

  fetchPosts() : void {
    let userJson = localStorage.getItem("user") as string;
    let user = JSON.parse(userJson) as UserInfo;
    let params = new HttpParams().set("email", user.email).set("groups", user.groups.join("\n"));
    this.http.get<Post[]>(CombineUrls(apiUrl, "Post/posts"), {params})
      .subscribe(x => {
        this.posts = x;
        console.log(x);
      });
  }
  getCoverImage(html : string) : string {
    let t = html.indexOf('data:image/');
    if(t == undefined) return "";
    return html.substr(t, html.indexOf("/>", t) - t);
}
  getStyle(item : Post) {
   return "background-image: url(getCoverImage("+item.html+"))";
  }
}
