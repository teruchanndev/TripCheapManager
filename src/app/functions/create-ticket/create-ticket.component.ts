import { Component, OnInit, Input } from '@angular/core';

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

}
