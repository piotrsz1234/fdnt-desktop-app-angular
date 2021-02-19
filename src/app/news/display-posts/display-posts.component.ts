import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Post } from '../post';
import { Where, CombineUrls, apiUrl, GetUser } from 'src/app/config';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { post } from 'selenium-webdriver/http';
import { UserInfo } from 'src/app/login/user';
import { APICalendarEvent } from 'src/app/calendar/calendarEvent';

declare let showToast: Function;
declare let openModalById: Function;

@Component({
  selector: 'app-display-posts',
  templateUrl: './display-posts.component.html',
  styleUrls: ['./display-posts.component.css']
})
export class DisplayPostsComponent implements OnInit {

  @Input()
  posts: Post[] = [];
  @Input()
  inEdition: boolean = false;

  @Output()
  change = new EventEmitter();
  
  currentlyInEdit: Post = new Post();
  tabs: string[] = [];
  minePosts: Post[] = [];

  constructor(private http : HttpClient) { }

  ngOnInit(): void {
    this.tabs = JSON.parse(localStorage.getItem("tabs") as string) as string[];
    this.getEditionPosts();
    this.change.subscribe(() => this.getEditionPosts());
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

  getPublishedPosts(): Post[] {
    return Where(this.posts, (p: Post) => p.isPublished);
  }

  getEditionPosts(): void {
    let email = (GetUser() as UserInfo).email;
    let params = new HttpParams().set("user", email);
    this.http.get<Post[]>(CombineUrls(apiUrl, "Post/posts/mine"), {params})
      .subscribe((observer) => {
        this.minePosts = observer;
      }, (err: HttpErrorResponse) => {
         showToast("Coś poszło nie tak :(") 
      });
  }

  publishPost(post: Post) {
    this.http.patch(CombineUrls(apiUrl, "Post/posts/publish"), post)
      .subscribe(() => {
        showToast("Udało się opublikować post!");
        this.change.emit();
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
    })
  }

  editPost(post: Post) {
    this.currentlyInEdit = post;
    openModalById("edition");
  }

  removePost(post: Post) {
    console.log(this.posts);
    const options = {
			headers: new HttpHeaders({
			  'Content-Type': 'application/json',
			}),
			body: post,
    };
    console.log(post.id);
    this.http.delete(CombineUrls(apiUrl, "Post/posts"), options)
      .subscribe(() => {
        this.change.emit();
        showToast("Udało się usunąć post");
      }, (err: HttpErrorResponse) => {
          showToast("Coś poszło nie tak :(");
    })
  }

  onRequestCompleted() {
    this.change.emit();
  }

}
