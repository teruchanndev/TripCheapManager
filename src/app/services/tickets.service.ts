import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Ticket } from '../modals/ticket.model';
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
    image: Array<File> | Array<string>) {

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
      ticketData.append('quantity', JSON.stringify(quantity));
      ticketData.append('address', address);
      ticketData.append('services', JSON.stringify(services));

      for (const file of image) {
        ticketData.append('image', file);
      }

    this.http
      .post<
        { message: string; ticket: Ticket }>
        (this.BACKEND_URL, ticketData)
      .subscribe(responseData => {
        this.getTickets();
        this.router.navigate(['home/list']);
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
    quantity: number,
    address: string,
    services: Array<object>,
    imageUrls: Array<string>,
    image: Array<File> | Array<string>) {
    // console.log(image);
    let ticketData: Ticket | FormData;
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
      ticketData.append('quantity', JSON.stringify(quantity));
      ticketData.append('imageUrls', JSON.stringify(imageUrls));
      ticketData.append('address', address);
      ticketData.append('services', JSON.stringify(services));
      for (const file of image) {
        ticketData.append('image', file);
      }

    console.log(ticketData);
    this.http
      .put(this.BACKEND_URL + id, ticketData)
      .subscribe(response => {
        this.router.navigate(['home/list']);
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
