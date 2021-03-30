import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Ticket } from './ticket.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';


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
              imagePath: ticket.imagePath,
              creator: ticket.creator
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
        imagePath: string,
        creator: string
      }>(this.BACKEND_URL + id);
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
    image: File) {
    
      const ticketData = new FormData();
      ticketData.append('title', title);
      ticketData.append('content', content);
      ticketData.append('status', JSON.stringify(status));
      ticketData.append('price', JSON.stringify(price));
      ticketData.append('price_reduce', JSON.stringify(price_reduce));
      ticketData.append('percent', JSON.stringify(percent));
      ticketData.append('category', category);
      ticketData.append('categoryService', categoryService);
      ticketData.append('city', city);
      ticketData.append('image', image, title);
      
    this.http
      .post<
        { message: string; ticket: Ticket }>
        (this.BACKEND_URL, ticketData)
      .subscribe(responseData => {
        // const ticket: Ticket = {
        //   id: responseData.ticket.id,
        //   title: title,
        //   content: content,
        //   status: status,
        //   price: price,
        //   price_reduce: price_reduce,
        //   percent: percent,
        //   category: category,
        //   categoryService: categoryService,
        //   city: city,
        //   imagePath: responseData.ticket.imagePath};

        // // const id = responseData.ticketId;
        // // ticket.id = id;
        // this.tickets.push(ticket);
        // this.ticketsUpdated.next([...this.tickets]);
        this.getTickets();
      });
      return ticketData;
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
    image: File | string) {

    let ticketData: Ticket | FormData;
    if(typeof image === 'object') {
      ticketData = new FormData();
      ticketData.append('id', id);
      ticketData.append('title', title);
      ticketData.append('content', content);
      ticketData.append('status', JSON.stringify(status));
      ticketData.append('price', JSON.stringify(price));
      ticketData.append('price_reduce', JSON.stringify(price_reduce));
      ticketData.append('percent', JSON.stringify(percent));
      ticketData.append('category', category);
      ticketData.append('categoryService', categoryService);
      ticketData.append('city', city);
      ticketData.append('image', image, title);
    } else {
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
        imagePath: image

      }
    }
    

    this.http
      .put(this.BACKEND_URL + id, ticketData)
      .subscribe(response => {
        // const updateTickets = [...this.tickets];
        // const oldTicketIndex = updateTickets.findIndex(p => p.id === id);
        // updateTickets[oldTicketIndex] = ticketData;
        // this.tickets = updateTickets;
        // this.ticketsUpdated.next([...this.tickets]);
        this.router.navigate(['/']);
      });
  }

  deleteTicket(ticketId: string) {
    console.log(ticketId);
    this.http
      .delete(this.BACKEND_URL + ticketId).subscribe(response => {
        console.log(response);
        this.getTickets();
      });
  }
}
