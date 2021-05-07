import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Ticket } from 'src/app/modals/ticket.model';
import { TicketsService } from 'src/app/services/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit, OnDestroy {

  private ticketsSub: Subscription;
  // tickets: Ticket[] = [];
  countQuantityTicket = 0;
  countTicket = 0;
  constructor(
    public ticketsService: TicketsService,
  ) { }
  

  ngOnInit(): void {
    // this.ticketsService.getTickets();
    // this.ticketsSub = this.ticketsService.getTicketUpdateListener()
    //   .subscribe((tickets: Ticket[]) => {
    //     // this.tickets = ticket;
    //     for(let i = 0; i< tickets.length; i++) {
    //       this.countQuantityTicket += tickets[i].quantity;
    //       console.log(tickets[i].quantity);
    //     }
    //     this.countTicket = tickets.length;
    //   });
  }

  ngOnDestroy(): void {
    // this.ticketsSub.unsubscribe();
  }

}
