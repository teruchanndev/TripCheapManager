import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/modals/order.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmailService } from 'src/app/services/email.service';
import { OrdersService } from 'src/app/services/order.service';

export interface ArrayOrder {
  orders: Order;
  priceNumber: number;
  price: string;
}

export interface ArrayOrderTotal {
  label: string;
  arrOrders: Array<ArrayOrder>;
  isConfirm: Array<boolean>;
}

export interface DialogData {
  content: string;
}

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})

export class OrderListComponent implements OnInit, OnDestroy {

  private orderListenerSubs: Subscription;

  userIsAuthenticated = false;
  emailCustomer: string;
  ArrOrders: Array<ArrayOrder> = [];
  ordersNew: Array<ArrayOrder> = []; // order mới
  ordersComplete: Array<ArrayOrder> = []; // order đã hoàn thành
  ordersCancel: Array<ArrayOrder> = []; // order đã bị hủy

  ArrayOrderTotal: Array<ArrayOrderTotal> = [];
  labels = ['Đơn mới', 'Đơn đã hoàn thành', 'Đơn đã hủy', 'Đơn bị hủy'];
  listTabValue = [];
  cost = [];

  content: string;
  from: string;
  isConfirm = [];

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    public dialog: MatDialog,
    private authService: AuthService,
    public customerService: CustomerService,
    public orderService: OrdersService,
    private router: Router,
    public route: ActivatedRoute,
    public emailService: EmailService
  ) { }
  

  ngOnInit(): void {
    this.authService.autoAuthUser();
    this.userIsAuthenticated = this.authService.getIsAuth();

    this.orderService.getOrderOfCreator();
    this.orderListenerSubs = this.orderService.getOrderUpdateListener()
      .subscribe((order: Order[]) => {
        // cal price total
        for (let i = 0; i < order.length ; i++) {
          let sum = 0;
          for (let j = 0; j < order[i].itemService.length; j++) {
            // tslint:disable-next-line:radix
            sum += parseInt(order[i].itemService[j].itemServicePrice) * order[i].itemService[j].quantity;
          }
          this.ArrOrders[i] = {
            orders: order[i],
            priceNumber: sum,
            price: sum.toLocaleString('en-us', {minimumFractionDigits: 2})
          };
        }

        this.listTabValue.push(this.ArrOrders.filter(
          element => !element.orders.status && !element.orders.isCancel && !element.orders.isSuccess)); //mới
        this.listTabValue.push(this.ArrOrders.filter(
          element => element.orders.status)); //đã hoàn thành
        this.listTabValue.push(this.ArrOrders.filter(
          element => element.orders.isSuccess)); //đã hủy
        this.listTabValue.push(this.ArrOrders.filter(
          element => element.orders.isCancel)); //bị hủy

        
        for (let i = 0; i < 4; i++) {
          this.ArrayOrderTotal[i] = {
            label: this.labels[i],
            arrOrders: this.listTabValue[i],
            isConfirm: Array(this.listTabValue[i].length).fill(false)
          };
        }
        //tổng cost mỗi tab
        for(let i = 0;i < 4 ; i++) {
          let sum = 0;
          for(let j = 0; j < this.ArrayOrderTotal[i].arrOrders.length; j++) {
            sum += this.ArrayOrderTotal[i].arrOrders[j].priceNumber;
          }
          this.cost.push(sum.toLocaleString('en-us', {minimumFractionDigits: 2}));
        }

        console.log(this.ArrayOrderTotal);
      });
  }

  CancelOrderManager(idOrder, idCustomer) {
    this.customerService.getInfoCustomerFromManager(idCustomer).subscribe(
      infoCustomer => {
        this.emailCustomer = infoCustomer.email;
      });

    setTimeout(() => {

      this.emailService.sendEmail(
        this.emailCustomer,
        'tripcheap.pay@gmail.com',
        'Thông báo hủy đơn hàng - TripCheap',
        'this is email from TripCheap team.',
        'hello'
      );
      const dialogRef = this.dialog.open(DialogSendMail, {
        width: '250px',
        data: {content: this.content}
      });
      dialogRef.afterClosed().subscribe(result => {
        this.content = result;
        // this.emailService.sendEmail(
        //   this.emailCustomer,
        //   'tripcheap.pay@gmail.com',
        //   'Thông báo hủy đơn hàng - TripCheap',
        //   'this is email from TripCheap team.',
        //   this.content
        // );
    
        this.orderService.updateIsSuccessOrder(idOrder, true, false);
        this._document.defaultView.location.reload();
      });
    }, 1000);
  }

  ConfirmOrderManager(idOrder, idCustomer, indexTab, i) {
    // this.emailService.sendEmail(
        //   this.emailCustomer,
        //   'tripcheap.pay@gmail.com',
        //   'Thông báo hủy đơn hàng - TripCheap',
        //   'this is email from TripCheap team.',
        //   this.content
        // );
    
    this.ArrayOrderTotal[indexTab].isConfirm[i] = true;
    this.orderService.updateIsSuccessOrder(idOrder, false, true);
    this._document.defaultView.location.reload();
  }

  ngOnDestroy(): void {
    this.orderListenerSubs.unsubscribe();
  }
}


@Component({
  selector: 'dialog-send-mail',
  templateUrl: 'dialog-send-mail.html',
})
export class DialogSendMail {

  constructor(
    public dialogRef: MatDialogRef<DialogSendMail>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
