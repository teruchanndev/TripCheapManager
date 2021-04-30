import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/modals/order.model';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer.service';
import { EmailService } from 'src/app/services/email.service';
import { OrdersService } from 'src/app/services/order.service';
import { Customer } from 'src/app/modals/customer.model';
import { QRCodeModule, QRCodeComponent } from 'angularx-qrcode';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { map, finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface ArrayOrder {
  orders: Order;
  priceNumber: number;
  price: string;
  qrcode: string;
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

  @ViewChild('canvas') canvas: ElementRef;
  @ViewChild('qrcode') qrcode: QRCodeComponent;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;


  private orderListenerSubs: Subscription;

  qrcodeContent = '';

  userIsAuthenticated = false;
  emailCustomer: string;
  ArrOrders: Array<ArrayOrder> = [];

  ArrayOrderTotal: Array<ArrayOrderTotal> = [];
  labels = ['Đơn mới', 'Đơn đã xác nhận',  'Đơn đã hủy'];
  displayedColumns: string[] = ['date', 'nameTicket', 'service', 'quantity', 'price', 'qrcode',  'delete', 'confirm'];
  listTabValue = [];
  cost = [];

  content: string;
  from: string;
  isConfirm = [];

  constructor(
    private storage: AngularFireStorage,
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
            price: sum.toLocaleString('en-us', {minimumFractionDigits: 0}),
            qrcode: order[i].id + ' - ' + order[i].payMethod
          };
        }

        this.listTabValue.push(this.ArrOrders.filter(
          element => !element.orders.status && !element.orders.isCancel && !element.orders.isConfirm)); // mới
        this.listTabValue.push(this.ArrOrders.filter(
          element => element.orders.isConfirm && !element.orders.isCancel)); // đơn chưa dùng
        // this.listTabValue.push(this.ArrOrders.filter(
        //   element => element.orders.status && element.orders.isConfirm)); // đơn đã dùng
        this.listTabValue.push(this.ArrOrders.filter(
          element => element.orders.isCancel)); // đơn đã hủy

        for (let i = 0; i < 3; i++) {
          console.log('tab: ', this.listTabValue[i]);
          this.ArrayOrderTotal[i] = {
            label: this.labels[i],
            arrOrders: this.listTabValue[i],
            isConfirm: Array(this.listTabValue[i].length).fill(false)
          };
        }
        // tổng cost mỗi tab
        for (let i = 0; i < 4 ; i++) {
          let sum = 0;
          for (let j = 0; j < this.ArrayOrderTotal[i].arrOrders.length; j++) {
            sum += this.ArrayOrderTotal[i].arrOrders[j].priceNumber;
          }
          this.cost.push(sum.toLocaleString('en-us', {minimumFractionDigits: 0}));
        }

        console.log(this.ArrayOrderTotal);
      });
  }

  handleDismiss(dismissMethod: string) {

  }

  CancelOrderManager(idOrder: string, idCustomer: string) {

    const username = new Promise((resolve, reject) => {
      this.customerService.getInfoCustomerFromManager(idCustomer).subscribe(
        infoCustomer => resolve(infoCustomer.username),
        err => reject(err)
    ); });


    const email = new Promise((resolve, reject) => {
      this.customerService.getInfoCustomerFromManager(idCustomer).subscribe(
        infoCustomer => resolve(infoCustomer.email),
        err => reject(err)
    ); });


    Promise.all([username, email]).then(
      async values => {
        console.log('test');
        const { value: text } = await Swal.fire({
          input: 'textarea',
          inputLabel: 'Gửi lý do tới cho khách hành của bạn!',
          inputPlaceholder: 'Nhập lý do...',
          inputAttributes: {
            'aria-label': 'Nhập ở đây'
          },
          showCancelButton: true
        });

        if (text) {
          this.orderService.updateIsSuccessOrder(idOrder, false, true);
          const textEmail = `
          <div>
            <h3>Xin chào ` + values[0] + `,</h3>
            <p>Cảm ơn bạn đã đặt vé trên trang web <span style="font-weight: bold;">TripCheap.</span>
              Chúng tôi rất tiếc phải thông báo với bạn đơn hàng đã bị hủy vì lý do từ đại lý như sau:
            </p>
            <div style="padding: 5px; border: 1px solid #f2f2f2; border-radius: 10px;">
              <p style="font-style: italic;">` + text + `</p>
            </div>
            <p>Sorry,</p>
            <p style="font-weight: bold;">TripCheap,</p>
            <p><span style="font-weight: bold;">Email: </span>tripcheap@gmail.com</p>
            <p><span style="font-weight: bold;">Số điện thoại: </span>039 994 5504</p>
          </div>`;
          // console.log('test1');
          this.emailService.sendEmail(
            values[1].toString(),
            'tripcheap.pay@gmail.com',
            'Thông báo hủy đơn hàng - TripCheap',
            'this is email from TripCheap team.',
            textEmail
          ).then(res => {
            Swal.fire({
              title: 'Đã gửi mail hủy đơn hàng thành công!',
              icon: 'success'}).then(() => {
                this._document.defaultView.location.reload();
              });
          });
        }
    }).catch(err => {console.log(err); });

  }

  dataURLtoFile(dataurl, filename) {
    console.log('dataurl ', dataurl);
    // tslint:disable-next-line:prefer-const
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        // tslint:disable-next-line:prefer-const
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }


  ConfirmOrderManager(idOrder: any, idCustomer: any, indexTab: any, i: any) {
    // console.log(i+1);
    const username = new Promise((resolve, reject) => {
      this.customerService.getInfoCustomerFromManager(idCustomer).subscribe(
        infoCustomer => resolve(infoCustomer.username),
        err => reject(err)
    ); });

    const email = new Promise((resolve, reject) => {
      this.customerService.getInfoCustomerFromManager(idCustomer).subscribe(
        infoCustomer => resolve(infoCustomer.email),
        err => reject(err)
    ); });

    const qrcode = new Promise((resolve, reject) => {
      // init file name to upload firebase storage
      const n = Date.now();
      const filePath = `qrcode/${n}`;
      const fileRef = this.storage.ref(filePath);

      // tslint:disable-next-line:no-shadowed-variable
      const x = new Promise((resolve) => {
        resolve(this.qrcode.qrcElement.nativeElement.innerHTML);
      }).then((value) => {
          const valueString = value as string;
          // str = valueString.substr(10, valueString.length - 12);
          // tslint:disable-next-line:max-line-length
          const task = this.storage.upload(`qrcode/${n}`, this.dataURLtoFile(valueString.substr(10, valueString.length - 12), 'qrcode-' + idOrder.toString() + '.png'));
          task.snapshotChanges().pipe(
          finalize(() => fileRef.getDownloadURL().subscribe(
            res => resolve(res),
            err => reject(err)
          ))).subscribe();
      });
    });

    let textItemService = '';
    for (const item of this.ArrayOrderTotal[indexTab].arrOrders[i].orders.itemService) {
      textItemService +=
        `<tr>
          <td style="width: fit-content;">` + item.itemServiceName + `: </td>
          <td>` + item.quantity + `</td>
        </tr>`;
    }

    Promise.all([username, email, qrcode]).then( values => {
      this.orderService.updateIsSuccessOrder(idOrder, true, false);
      const textEmail = `
        <div>
          <h3>Xin chào ` + values[0] + `,</h3>
          <p>Cảm ơn bạn đã đặt vé trên trang web <span style="font-weight: bold;">TripCheap.</span>
            Đơn hàng của bạn đã được đại lý xác nhận đơn.
            Mã QR code của bạn chỉ có hiệu lực trong khoảng thời gian từ
            <span style="font-weight: bold;">` + this.ArrayOrderTotal[indexTab].arrOrders[i].orders.dateStart  + `</span> tới
            <span style="font-weight: bold;">` + this.ArrayOrderTotal[indexTab].arrOrders[i].orders.dateEnd  + `</span>.
          </p>
          <p style="font-style: italic;">
            <span style="font-weight: bold;">Lưu ý:</span> Chỉ được hủy đơn hàng trước ngày hết hạn là một ngày.
          </p>
          <div>
            <tbody style="width:100%">
              <tr>
                <td style="width: fit-content;">Tên vé: </td>
                <td>` + this.ArrayOrderTotal[indexTab].arrOrders[i].orders.nameTicket + `</td>
              </tr>
              <tr>
                <td style="width: fit-content;">Dịch vụ: </td>
                <td>` + this.ArrayOrderTotal[indexTab].arrOrders[i].orders.itemService[0].name + `</td>
              </tr>
              ` + textItemService + `
              <tr>
                <td style="width: fit-content;">Tổng cộng:</td>
                <td style="font-weight: bold;">` +
                  this.ArrayOrderTotal[indexTab].arrOrders[i].priceNumber.toLocaleString('en-us', {minimumFractionDigits: 0}) + `đ</td>
              </tr>
            </tbody>
          <div>
          <div>
            <p>Sử dụng mã QR để vào cổng:</p>
            <div style="box-shadow: 0 0 20px #e2e1e1;border-radius: 20px;">
              <img style="text-align: center;" src="` + values[2] + `">
            </div>
          </div>
          <p>Thank you,</p>
          <p style="font-weight: bold;">TripCheap,</p>
          <p><span style="font-weight: bold;">Email: </span>tripcheap@gmail.com</p>
          <p><span style="font-weight: bold;">Số điện thoại: </span>039 994 5504</p>
        </div>`;
      Swal.fire({
        title: 'Bạn có muốn xác nhận đơn hàng!',
        showDenyButton: true,
        confirmButtonText: `Xác Nhận`,
        denyButtonText: `Hủy`,
        icon: 'info'
      }).then((result) => {
        if (result.isConfirmed) {
          this.emailService.sendEmail(
            values[1].toString(),
            'tripcheap.pay@gmail.com',
            this.ArrayOrderTotal[indexTab].arrOrders[i].orders.nameTicket + '- Đơn hàng đã được xác nhận!',
            'This is email from TripCheap.',
            textEmail
          ).then(res => {
            Swal.fire({
              title: 'Đã gửi mail xác nhận đơn tới khách hàng thành công!',
              icon: 'success'}).then(() => {
                this._document.defaultView.location.reload();
              });
          });
        } else if (result.isDenied) {}
      });

    });
  }

  ngOnDestroy(): void {
    this.orderListenerSubs.unsubscribe();
  }
}

