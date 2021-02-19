import { Component, OnInit } from '@angular/core';
import { Post } from '../post';
import { getDateString } from 'src/app/config';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  constructor() { }

  post : Post = new Post();

  ngOnInit(): void {
    this.post = JSON.parse(localStorage.getItem("post") as string) as Post;
    (document.getElementById("post-body") as HTMLElement).innerHTML = this.post.html;
  }

  emailToFancyName(email: string): string {
    email = email.substr(0, email.indexOf('@'));
    email = email.substr(0, 1).toUpperCase() + email.substr(1);
    let index = email.indexOf('.') + 1;
    email = email.substr(0, index) + email.substr(index, 1).toUpperCase() + email.substr(index + 1);
    email = email.replace('.', ' ');
    return email;
  }

  getDate() {
    let temp = new Date(this.post.publishTime);
    console.log(temp);
    return getDateString(temp);
  }

}
