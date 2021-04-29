import { AfterViewInit, Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';

import { Ticket } from '../../modals/ticket.model';
import { TicketsService } from '../../services/tickets.service';
import { ViewChild } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit, OnDestroy, AfterViewInit  {

  tickets:  Ticket[] = [];
  isLoading = false;
  private ticketsSub: Subscription;
  private authStatusSub: Subscription;

  

  userIsAuthenticated = false;
  userId: string;
  dataSource = [];
  listTicket = [];
  tabName = ['Vé Công Khai', 'Vé Ẩn'];
  displayedColumns: string[] = ['title', 'category', 'city', 'quantity', 'price_reduce', 'edit', 'delete'];


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public ticketsService: TicketsService,
    private authService: AuthService,
    private router: Router) { }

  ngAfterViewInit() {
    for (const item of this.dataSource) {
      item.paginator = this.paginator;
      item.sort = this.sort;
    }

  }
  ngOnInit() {
    this.isLoading = true;
    this.userId = this.authService.getUserId();
    this.ticketsService.getTickets();
    this.ticketsSub = this.ticketsService.getTicketUpdateListener()
      .subscribe((ticket: Ticket[]) => {
        this.isLoading = false;
        this.tickets = ticket;

        this.listTicket.push(this.tickets.filter(
          element => element.status));
        this.listTicket.push(this.tickets.filter(
          element => !element.status));

        for (let i = 0; i < this.listTicket.length; i++) {
          this.dataSource[i] = new MatTableDataSource(this.listTicket[i]);
        //  this.dataSource[i].paginator = this.paginator;
        //  this.dataSource[i].sort = this.sort;
        }
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    for (const item of this.dataSource) {
      item.filter = filterValue.trim().toLowerCase();

      if (item.paginator) {
        item.paginator.firstPage();
      }
    }
  }

  onDelete(ticketId: string) {
    Swal.fire({
      title: 'Đồng ý xóa vé',
      showDenyButton: true,
      confirmButtonText: `Xóa`,
      denyButtonText: `Hủy`,
      icon: 'error'
    }).then((result)=> {
      if (result.isConfirmed) {
        this.ticketsService.deleteTicket(ticketId).subscribe((result) => {
          Swal.fire({
            title: "Đã xóa vé thành công!",
            icon: 'success'}).then(()=> {
              this._document.defaultView.location.reload();
            });
        });
      } else if (result.isDenied) {}
    });
  }

  ngOnDestroy(): void {
    this.ticketsSub.unsubscribe();
  }

}
