import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';

import { PostsService } from "../posts.service";
import { Post } from "../post.model";

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnChanges {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  private mode = 'create';
  // private postId: string;

  // @Output() newPost = new EventEmitter<Post>();
  @Input() postId: string;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute
  ) {}

  ngOnChanges() {
    this.postsService.getPost(this.postId).subscribe(postData => {
      // this.isLoading = false;
      this.post = {id: postData._id, title: postData.title, content: postData.content};
    });
  }

  ngOnInit() {
    this.postId = '';
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      // if (paramMap.has("postId")) {
      //   this.mode = "edit";
      //   this.postId = paramMap.get("postId");
      //   this.isLoading = true;
      //   this.postsService.getPost(this.postId).subscribe(postData => {
      //     this.isLoading = false;
      //     this.post = {id: postData._id, title: postData.title, content: postData.content};
      //   });
      // } else {
      //   this.mode = "create";
      //   this.postId = null;
      // }

        this.postsService.getPost(this.postId).subscribe(postData => {
          // this.isLoading = false;
          this.post = {id: postData._id, title: postData.title, content: postData.content};
        });
    });
  }

  onCreate(form) {
    this.postId = '';
    form.reset();
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    // if (this.mode === "create") {
    //   this.postsService.addPost(form.value.title, form.value.content);
    // } else {
    //   this.postsService.updatePost(
    //     this.postId,
    //     form.value.title,
    //     form.value.content
    //   );
    // }

    if (this.postId !== '') {
      this.postsService.updatePost(
            this.postId,
            form.value.title,
            form.value.content
          );
    } else {
      const post = this.postsService.addPost(form.value.title, form.value.content);
    }

    // this.newPost.emit(post);
    form.reset();
  }
}
