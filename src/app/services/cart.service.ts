import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Cart } from '../modals/cart.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { stringify } from '@angular/compiler/src/util';
import { ServiceSelect } from '../modals/serviceSelect.model';

@Injectable({ providedIn: 'root' })
export class CartsService {
  private carts: Cart[] = [];
  private cartsUpdated = new Subject<Cart[]>();
  BACKEND_URL = environment.apiURL + '/cart/';

  constructor(
    private http: HttpClient,
    private router: Router) {}

  getCarts() {
    this.http
    .get<{ message: string; cart: any }>(this.BACKEND_URL)
    .pipe(
      map(cartData => {
        console.log(cartData);
        return cartData.cart.map(cart => {
          return {
            id: cart._id,
            nameTicket: cart.nameTicket,
            imageTicket: cart.imageTicket,
            dateStart: cart.dateStart,
            dateEnd: cart.dateEnd,
            idTicket: cart.idTicket,
            idCreator: cart.idCreator,
            idCustomer: cart.idCustomer,
            itemService: cart.itemService
          };
        });
      })
    ).subscribe(transformedCart => {
      console.log(transformedCart);
      this.carts = transformedCart;
      this.cartsUpdated.next([...this.carts]);
    });
  }

  getCartUpdateListener() {
    return this.cartsUpdated.asObservable();
  }

  getOneCart(id: string) {
    return this.http.get<{
      _id: string;
      nameTicket: string;
      imageTicket: string;
      dateStart: string;
      dateEnd: string;
      idTicket: string;
      idCreator: string;
      idCustomer: string;
      itemService: Array<ServiceSelect>;
    }>(this.BACKEND_URL + 'update/'  + id);
  }

  getCountCart() {
    return this.http.get<{
      countCart: number;
    }>(this.BACKEND_URL + 'count');
  }

  getCartOfCustomer() {
    this.http.get<
      { message: string; cart: any }>
      (this.BACKEND_URL + 'cart').pipe(
        map(cartData => {
          return cartData.cart.map(cart => {
            return {
              id: cart._id,
              nameTicket: cart.nameTicket,
              imageTicket: cart.imageTicket,
              dateStart: cart.dateStart,
              dateEnd: cart.dateEnd,
              idTicket: cart.idTicket,
              idCreator: cart.idCreator,
              idCustomer: cart.idCustomer,
              itemService: cart.itemService
            };
          });
        })
      ).subscribe(transformedCart => {
        this.carts = transformedCart;
        this.cartsUpdated.next([...this.carts]);
      });
  }

  addCart(
    nameTicket: string,
    imageTicket: string,
    dateStart: string,
    dateEnd: string,
    idTicket: string,
    idCreator: string,
    idCustomer: string,
    itemService: Array<ServiceSelect>
  ) {
    // tslint:disable-next-line:prefer-const
    let cartData: Cart | FormData;
    cartData = {
        id: null,
        nameTicket: nameTicket,
        imageTicket: imageTicket,
        dateStart: dateStart,
        dateEnd: dateEnd,
        idTicket: idTicket,
        idCreator: idCreator,
        idCustomer: idCustomer,
        itemService: itemService
    };
    this.http
      .post<
        { message: string; cart: Cart }>
        (this.BACKEND_URL, cartData)
      .subscribe(responseData => {
        console.log(responseData);
      });
        console.log(cartData);
    return cartData;
  }

  updateCart(
    id: string,
    nameTicket: string,
    imageTicket: string,
    dateStart: string,
    dateEnd: string,
    idTicket: string,
    idCreator: string,
    idCustomer: string,
    itemService: Array<ServiceSelect>
  ) {
    let cartData: Cart | FormData;
    cartData = {
        id: id,
        nameTicket: nameTicket,
        imageTicket: imageTicket,
        dateStart: dateStart,
        dateEnd: dateEnd,
        idTicket: idTicket,
        idCreator: idCreator,
        idCustomer: idCustomer,
        itemService: itemService
    };

    this.http
      .put<{ message: string; cart: Cart }>
        (this.BACKEND_URL + id, cartData)
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  deleteCart(cartId: Array<string>) {
    console.log(cartId);
    this.http
      .delete(this.BACKEND_URL + 'list/' + cartId.join()).subscribe(response => {
        console.log(response);
        this.getCarts();
      });
  }

  getCartToPay(cartId: Array<string>) {
    console.log(cartId);
    this.http.get<{ message: string; cart: any }>(this.BACKEND_URL + 'pay/' +  cartId.join())
    .pipe(
      map(cartData => {
        console.log(cartData);
        return cartData.cart.map(cart => {
          return {
            id: cart._id,
            nameTicket: cart.nameTicket,
            imageTicket: cart.imageTicket,
            dateStart: cart.dateStart,
            dateEnd: cart.dateEnd,
            idTicket: cart.idTicket,
            idCreator: cart.idCreator,
            idCustomer: cart.idCustomer,
            itemService: cart.itemService
          };
        });
      })
    ).subscribe(transformedCart => {
      console.log(transformedCart);
      this.carts = transformedCart;
      this.cartsUpdated.next([...this.carts]);
    });
  }

}
