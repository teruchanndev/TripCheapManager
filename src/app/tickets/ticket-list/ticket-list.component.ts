import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, OnDestroy {

  tickets:  Ticket[] = [];
  isLoading = false;
  private ticketsSub: Subscription;

  dataSource;
  displayedColumns: string[] = ['title', 'category', 'city', 'image', 'price_reduce', 'edit', 'delete'];


  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(public ticketsService: TicketsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.ticketsService.getTickets();
    this.ticketsSub = this.ticketsService.getTicketUpdateListener()
      .subscribe((ticket: Ticket[]) => {
        this.isLoading = false;
        this.tickets = ticket;
        this.dataSource = new MatTableDataSource(ticket);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onDelete(ticketId: string) {
      this.ticketsService.deleteTicket(ticketId);
  }

  ngOnDestroy(): void {
    this.ticketsSub.unsubscribe();
  }

}
