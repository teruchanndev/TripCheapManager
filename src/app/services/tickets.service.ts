import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Ticket } from '../modals/ticket.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';


@Injectable({ providedIn: 'root' })
export class TicketsService {
  private tickets: Ticket[] = [];
  private ticketsUpdated = new Subject<Ticket[]>();
  BACKEND_URL = environment.apiURL + '/tickets/';

  constructor(private http: HttpClient, private router: Router) {}


  getTickets() {
    this.http
      .get<{ message: string; ticket: any }>(this.BACKEND_URL)
      .pipe(
        map(ticketData => {
          return ticketData.ticket.map(ticket => {
            return {
              id: ticket._id,
              title: ticket.title,
              content: ticket.content,
              status: ticket.status,
              price: ticket.price,
              price_reduce: ticket.price_reduce,
              percent: ticket.percent,
              category: ticket.category,
              categoryService: ticket.categoryService,
              city: ticket.city,
              quantity: ticket.quantity,
              imagePath: ticket.imagePath,
              address: ticket.address,
              creator: ticket.creator,
              services: ticket.services
            };
          });
        })
      )
      .subscribe(transformedTickets => {
        console.log(transformedTickets);
        this.tickets = transformedTickets;
        this.ticketsUpdated.next([...this.tickets]);
      });
  }

  getAll() {
    this.http
      .get<{ message: string; ticket: any }>(this.BACKEND_URL + 'all')
      .pipe(
        map(ticketData => {
          console.log(ticketData);
          return ticketData.ticket.map(ticket => {
            return {
              id: ticket._id,
              title: ticket.title,
              content: ticket.content,
              status: ticket.status,
              price: ticket.price,
              price_reduce: ticket.price_reduce,
              percent: ticket.percent,
              category: ticket.category,
              categoryService: ticket.categoryService,
              city: ticket.city,
              quantity: ticket.quantity,
              imagePath: ticket.imagePath,
              address: ticket.address,
              creator: ticket.creator,
              services: ticket.services
            };
          });
        })
      ).subscribe(transformedTickets => {
        console.log(transformedTickets);
        this.tickets = transformedTickets;
        this.ticketsUpdated.next([...this.tickets]);
      });
  }

  getTicketUpdateListener() {
    return this.ticketsUpdated.asObservable();
  }

  getTicket(id: string) {
    return this.http.get<{
        _id: string;
        title: string;
        content: string;
        status: boolean;
        price: number;
        price_reduce: number;
        percent: number;
        category: string;
        categoryService: string;
        city: string;
        quantity: number;
        address: string;
        services: Array<object>;
        imagePath: Array<string>;
        creator: string
      }>(this.BACKEND_URL + id);
  }

  getTicketOfCity(city: string) {
    console.log(city);
    this.http
      .get<{ message: string; ticket: any }>(this.BACKEND_URL + 'city/' + city)
      .pipe(
        map(ticketData => {
          console.log(ticketData);
          return ticketData.ticket.map(ticket => {
            return {
              id: ticket._id,
              title: ticket.title,
              content: ticket.content,
              status: ticket.status,
              price: ticket.price,
              price_reduce: ticket.price_reduce,
              percent: ticket.percent,
              category: ticket.category,
              categoryService: ticket.categoryService,
              city: ticket.city,
              quantity: ticket.quantity,
              imagePath: ticket.imagePath,
              address: ticket.address,
              creator: ticket.creator,
              services: ticket.services
            };
          });
        })
      ).subscribe(transformedTickets => {
        console.log(transformedTickets);
        this.tickets = transformedTickets;
        this.ticketsUpdated.next([...this.tickets]);
      });
  }

  addTicket(
    title: string,
    content: string,
    status: boolean,
    price: number,
    price_reduce: number,
    percent: number,
    category: string,
    categoryService: string,
    city: string,
    quantity: number,
    address: string,
    services: Array<object>,
    imagePath: Array<string>) {

    const ticketData = {
      title: title,
      content: content,
      status: status,
      price: price,
      price_reduce: price_reduce,
      percent: percent,
      category: category,
      categoryService: categoryService,
      city: city,
      quantity: quantity,
      address: address,
      services: services,
      imagePath: imagePath
    };
    return new Promise((resolve) => {
      this.http
      .post<
        { message: string; ticket: Object }>
        (this.BACKEND_URL, ticketData)
      .subscribe(responseData => {
        resolve(ticketData);
      });
    });
    
  }

  updateTickets(id: string, title: string,
    content: string,
    status: boolean,
    price: number,
    price_reduce: number,
    percent: number,
    category: string,
    categoryService: string,
    city: string,
    quantity: number,
    address: string,
    services: Array<object>,
    imagePath: Array<string>) {
      
    let ticketData: Object;
    // console.log('imagePath: ', JSON.stringify(imagePath));
    ticketData = {
      id: id,
      title: title,
      content: content,
      status: status,
      price: price,
      price_reduce: price_reduce,
      percent: percent,
      category: category,
      categoryService: categoryService,
      city: city,
      quantity: quantity,
      address: address,
      services: services,
      imagePath: imagePath
    };

    return new Promise((resolve) => {
      this.http
      .put(this.BACKEND_URL + id, ticketData)
      .subscribe(response => {
        resolve(ticketData);
      });
    });
  }

  deleteTicket(ticketId: string) {
    return this.http
      .delete(this.BACKEND_URL + ticketId);
  }

  updateQuantity() {
    
  }
}
