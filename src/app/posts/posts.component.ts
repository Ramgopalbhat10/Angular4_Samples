import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent {
  posts: any[];
  isRead: boolean = false;
  private url = "https://jsonplaceholder.typicode.com/posts";

  constructor(private http: Http) {
    http.get(this.url)
      .subscribe((response) => {
        this.posts = response.json();
      });
  }

  createPost(input: HTMLInputElement) {
    let post: any = { title: input.value };
    input.value = '';

    this.http.post(this.url, JSON.stringify(post))
      .subscribe(response => {
        post.id = response.json().id;
        this.posts.splice(0, 0, post);
      });
  }

  updatePost(post, check, listItem) {
    if(check.title === "Mark as Read") {
      check.style.color = "#4caf50";
      listItem.style.background = "#4caf502e";
      check.title = "Mark as Unread";
    } else if(check.title === "Mark as Unread") {
      check.style.color = "#c1c1c1";
      listItem.style.background = "#fff";
      check.title = "Mark as Read";
    }

    this.http.patch(this.url + '/' + post.id, JSON.stringify({ isRead: true }))
      .subscribe(response => {
        console.log(response.json());
      });
  }
}
