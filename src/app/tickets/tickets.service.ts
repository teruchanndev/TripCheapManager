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
  private ticketsFind: Ticket[] = [];
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
        quantity: number;
        imagePath: Array<string>,
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
    quantity: number,
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

      for(let file of image){
        ticketData.append('image', file);
      }
      // ticketData.append('image', JSON.stringify(image), title);
    this.http
      .post<
        { message: string; ticket: Ticket }>
        (this.BACKEND_URL, ticketData)
      .subscribe(responseData => {
        this.getTickets();
        this.router.navigate(['/list']);
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
    imageUrls: Array<string>,
    image: Array<File> | Array<string>) {
    console.log(image);
    let ticketData: Ticket | FormData;
    //if (typeof image === 'object') {
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
      for(let file of image){
        // console.log(file);
        ticketData.append('image', file);
      }

    // } else {
    //   ticketData = {
    //     id: id,
    //     title: title,
    //     content: content,
    //     status: status,
    //     price: price,
    //     price_reduce: price_reduce,
    //     percent: percent,
    //     category: category,
    //     categoryService: categoryService,
    //     city: city,
    //     quantity: quantity,
    //     imagePath: image

    //   };
    // }
    console.log(ticketData);
    this.http
      .put(this.BACKEND_URL + id, ticketData)
      .subscribe(response => {
        // this.router.navigate(['/']);
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
