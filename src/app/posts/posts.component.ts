import { BadIput } from './../common/bad-input';
import { NotFoundError } from './../common/not-found-error';
import { AppError } from './../common/app-error';
import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';

@Component({
  selector: 'posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  posts: any[];
  isRead: boolean = false;
  
  constructor(private service: PostService) {
  }

  ngOnInit() {
    this.service.getPosts()
      .subscribe(
        response => {
          this.posts = response.json();
        }, 
        error => {
          alert("An unexpexted error occured.");
          console.log(error);
      });
  }

  createPost(input: HTMLInputElement) {
    let post: any = { title: input.value };
    input.value = '';

    this.service.createPost(post)
      .subscribe(
        response => {
          post.id = response.json().id;
          console.log(response.json());
          this.posts.splice(0, 0, post);
        }, 
        (error: AppError) => {
          if(error instanceof BadIput) {
            //some code
          }
          else {
            alert("An unexpexted error occured.");
            console.log(error);
          }
      });
  }

  updatePost(post, check, listItem) {
    if(check.title === "Mark as Read") {
      check.style.color = "#66BB6A";
      listItem.style.background = "#4caf502e";
      check.title = "Mark as Unread";
    } else if(check.title === "Mark as Unread") {
      check.style.color = "#c1c1c1";
      listItem.style.background = "#fff";
      check.title = "Mark as Read";
    }

    this.service.createPost(post)
      .subscribe(
        response => {
          console.log(response.json());
        }, 
        error => {
          alert("An unexpexted error occured.");
          console.log(error);
      });
  }

  deletePost(post){
    this.service.deletePost(post.id)
      .subscribe(
        response => {
          let index = this.posts.indexOf(post);
          this.posts.splice(index, 1);
        }, 
        (error: AppError) => {
          if(error instanceof NotFoundError)
            alert("This post has already been deleted");
          else {
            alert("An unexpexted error occured.");
            console.log(error);
          }
      });
    
  }
}
