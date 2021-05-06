import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ChartDataSets, ChartOptions } from 'chart.js';
// import { Color, Label } from 'ng2-charts';
import { map } from 'rxjs/operators';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';
import { Observable, Subject, Subscription } from 'rxjs';
import { colors } from './colors';
import { Order } from 'src/app/modals/order.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, SingleDataSet } from 'ng2-charts';

import { OrdersService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/modals/user.model';
import { TicketsService } from 'src/app/services/tickets.service';
import { Ticket } from 'src/app/modals/ticket.model';
// import { CalendarView } from 'angular-calendar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit, OnDestroy {

  private orderListenerSubs: Subscription;
  private ticketListenerSubs: Subscription;
  refresh: Subject<any> = new Subject();

  chartColors: Array<any> = [
    { // first color
      backgroundColor: ['#26c6da', '#ffe777', '#c0ffee']
    }
  ];
  options: any = {
    legend: { position: 'right' }
  };
  
  user: User;
  countOrder = 0;
  countTicket = 0;
  countTicketComplete = 0;
  revenueTicket = 0;
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  order: Array<Order> = [];
  // orderNew: Array<Order> = []; // đơn đã đặt
  orderCancel: Array<Order> = []; // đơn đã hủy
  orderComplete: Array<Order> = []; // đơn đã hoàn thành
  events: CalendarEvent[] = [];

  doughnutChartLabels: Label[] = ['Đơn đã đặt', 'Đơn đã hủy', 'Đơn đã hoàn thành'];
  doughnutChartData: SingleDataSet = [];
  doughnutChartType: ChartType = 'doughnut';

  constructor(
    public orderService: OrdersService,
    public userService: UserService,
    public ticketsService: TicketsService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.orderService.getOrderOfCreator();
    this.orderListenerSubs = this.orderService.getOrderUpdateListener()
      .subscribe((order: Order[]) => {
        this.countOrder = order.length;

        this.order = order.filter(element => !element.status && !element.isCancel && !element.isConfirm);
        this.orderCancel = order.filter(element => element.isCancel);
        this.orderComplete = order.filter(element => element.status);

        // ticket
        for(let item of this.orderComplete) {
          for(let itemService of item.itemService) {
            this.countTicketComplete += itemService.quantity;
            this.revenueTicket += itemService.quantity * parseInt(itemService.itemServicePrice);
          }
        }

        // add chart order
        this.doughnutChartData.push(this.order.length);
        this.doughnutChartData.push(this.orderCancel.length);
        this.doughnutChartData.push(this.orderComplete.length);
        
        // add event
        for(let item of this.order) {
          this.events.push({
            start: startOfDay(new Date(item.created_at)),
            title: item.nameTicket
          });
        };


      });
    
    this.userService.getInfoUser().subscribe(
      infoData => {
        this.user = {
          username: infoData.username,
          nameShop: infoData.nameShop,
          imageAvt: infoData.imageAvt,
          imageCover: infoData.imageCover,
          desShop: infoData.desShop,
          follower: infoData.follower,
          watching: infoData.watching,
          created_at: infoData.created_at
        }
      console.log('user', this.user);
      });
      this.ticketsService.getTickets();
      this.ticketListenerSubs = this.ticketsService.getTicketUpdateListener()
      .subscribe((ticket: Ticket[]) => {
        this.countTicket = ticket.reduce(
          ( accumulator, currentValue ) => accumulator + currentValue.price_reduce, 0);
      });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  activeDayIsOpen: boolean = false;

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  ngOnDestroy(): void {
    this.orderListenerSubs.unsubscribe();
    this.ticketListenerSubs.unsubscribe();
  }
}
