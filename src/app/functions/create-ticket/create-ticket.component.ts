import { Component, OnInit, Input } from '@angular/core';
import { Post } from 'src/app/posts/post.model';

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {

  postId: string;

  constructor() { }

  ngOnInit() {
  }

  bindList (post: Post) {
    console.log(post);
  }

  getId(postId: string) {
    console.log(postId);
    this.postId = postId;
  }
}
