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
    this.service.getAll()
      .subscribe(posts => this.posts = posts);
  }

  createPost(input: HTMLInputElement) {
    let post: any = { title: input.value };
    this.posts.splice(0, 0, post);
    
    input.value = '';

    this.service.create(post)
      .subscribe(
        newPost => {
          post.id = newPost.id;
          console.log(newPost);
        }, 
        (error: AppError) => {
          this.posts.splice(0, 1);

          if(error instanceof BadIput) {
            //some code
          }
          else throw error;
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

    this.service.update(post)
      .subscribe(
        updatedPost => {
          console.log(updatedPost);
        });
  }

  deletePost(post){
    let index = this.posts.indexOf(post);
    this.posts.splice(index, 1);

    this.service.delete(post.id)
      .subscribe(
        null, 
        (error: AppError) => {
          this.posts.splice(index, 0, post);

          if(error instanceof NotFoundError)
            alert("This post has already been deleted");
          else throw error;
      });
    
  }
}
