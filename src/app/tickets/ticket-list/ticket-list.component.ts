import { AfterViewInit, Component, OnInit, OnDestroy, Inject, ViewChildren, QueryList } from '@angular/core';
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
import { Category } from 'src/app/modals/category.model';
import { City } from 'src/app/modals/city.model';

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
  
  categories: Category[] = [];
  city: City[] = [];
  categoryFilter = [];
  cityFilter = [];
  allComplete = [];
  showDelete = false;

  selectedCategoryValue: string;
  selectedCityValue: string;

  userIsAuthenticated = false;
  userId: string;
  dataSource = [];
  listTicket = [];
  tabName = ['Vé Công Khai', 'Vé Ẩn'];
  displayedColumns: string[] = ['check', 'title', 'category', 'city', 'quantity', 'price_reduce', 'edit', 'delete'];


  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChildren(MatSort) sort = new QueryList<MatSort>();

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public ticketsService: TicketsService,
    private authService: AuthService,
    private router: Router) { }

  ngAfterViewInit() {
    for (let i = 0; i< this.dataSource.length; i++) {
      this.dataSource[i].paginator = this.paginator.toArray()[i];
      this.dataSource[i].sort = this.sort.toArray()[i];
    }
    // console.log('ngAfter: ', this.dataSource);
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
          this.allComplete[i] = [];
          this.listTicket[i].forEach(element => {
            // console.log(i);
            this.allComplete[i].push(false);
          });
        }

        console.log('all: ', this.allComplete);

        // filter category
        let arr = [];
        ticket.forEach(element => {
          arr.push(element.category);
        });
        this.categoryFilter = arr.reduce(
          (accumulator, currentItem) => accumulator.includes(currentItem) ? accumulator : [...accumulator, currentItem],[]
        );
        // filter city
        let arr2 = [];
        ticket.forEach(element => {
          arr2.push(element.city);
        });
        this.cityFilter = arr2.reduce(
          (accumulator, currentItem) => accumulator.includes(currentItem) ? accumulator : [...accumulator, currentItem],[]
        );


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
      console.log(filterValue);
      if (item.paginator) {
        item.paginator.firstPage();
      }
    }
  }

  filterTable(selected: string) {
    console.log(selected);
    // console.log(this.selectedCategoryValue);
    if(selected === "all") {
      for (const item of this.dataSource) {
        item.filter = "".trim().toLowerCase();
        if (item.paginator) {
          item.paginator.firstPage();
        }
      }
    } else {
      for (const item of this.dataSource) {
        item.filter = selected.trim().toLowerCase();
        // console.log(this.selectedCategoryValue);
        if (item.paginator) {
          item.paginator.firstPage();
        }
      }
    }
  }

  setAll(completed: boolean, index) {
    // console.log('index: ', index);
    if(completed) {
      this.showDelete = true;
      for(let i = 0; i< this.allComplete[index].length; i++) {
        this.allComplete[index][i] = true;
      }
      // console.log('index: ', this.allComplete[index]);
    } else {
      this.showDelete = false;
      for(let i = 0; i< this.allComplete[index].length; i++) {
        this.allComplete[index][i] = false;
      }
    }
  }

  setSome(completed: boolean, indexTab, indexitem) {
    if(completed) {
      this.showDelete = true;
      this.allComplete[indexTab][indexitem] = true;
    } else {
      this.allComplete[indexTab][indexitem] = false;
      var test = false;
      for(let i = 0; i< this.allComplete[indexTab].length; i++) {
        if(this.allComplete[indexTab][i]){ 
          test = true; 
        }
      }
      if(test) {
        this.showDelete = true;
      } else {
        this.showDelete = false;
      }
    }
  }

  _setDataSource(indexNumber) {
    setTimeout(() => {
      switch (indexNumber) {
        case 0:
          this.dataSource[0].paginator = this.paginator.toArray()[0];
          this.dataSource[0].sort = this.sort.toArray()[0];
          break;
        case 1:
          this.dataSource[1].paginator = this.paginator.toArray()[1];
          this.dataSource[1].sort = this.sort.toArray()[1];
      }
    },500);
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

  deleteTicketSelect(indexTab) {
    const arrId: Array<string> = [];
    for (let i = 0; i < this.allComplete[indexTab].length ; i++) {
      if (this.allComplete[indexTab][i] === true) {
        arrId.push(this.listTicket[indexTab][i].id);
      }
    }
    console.log(arrId);

    if (arrId.length > 0) {
      Swal.fire({
        title: 'Xóa hết những vé đã chọn?',
        icon: 'question',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.ticketsService.deleteListTicket(arrId).subscribe((res) => {
            Swal.fire({
              title: 'Đã xóa tất cả những vé đã chọn',
              icon: 'success'
            }).then(() => {
              this._document.defaultView.location.reload();
            });
          });
        } else {}
      });
    } else {
      Swal.fire({
        title: 'Bạn chưa lựa chọn vé nào!',
        icon: 'error'
      });
    }
  }

  ngOnDestroy(): void {
    this.ticketsSub.unsubscribe();
  }

}
