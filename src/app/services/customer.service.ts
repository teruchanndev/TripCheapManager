import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Customer } from '../modals/customer.model';


@Injectable({ providedIn: 'root' })

export class CustomerService {
    private infoCustomer: Customer[] = [];
    private infoCustomerUpdated = new Subject<Customer[]>();
    BACKEND_URL = environment.apiURL + '/customer/';

    constructor(private http: HttpClient, private router: Router) {}

    getInfoCustomer() {
        return this.http.get<{
            username: string,
            email: string,
            phoneNumber: string,
            fullName: string,
            address: string
        }>(this.BACKEND_URL + 'info');
    }

    getInfoCustomerFromManager(idCustomer: string) {
        return this.http.get<{
            username: string,
            email: string,
            phoneNumber: string,
            fullName: string,
            address: string
        }>(this.BACKEND_URL + idCustomer);
    }

    getCustomerUpdateListener() {
        return this.infoCustomerUpdated.asObservable();
      }

    updateInfo(
        email: string,
        phoneNumber: string,
        fullName: string,
        address: string,
        username: string,
    ) {
        let infoData: Customer | FormData;
            infoData = new FormData();
            infoData.append('email', email);
            infoData.append('phoneNumber', phoneNumber);
            infoData.append('fullName', fullName);
            infoData.append('address', address);
            infoData.append('username', username);

        console.log(infoData);

        this.http.put(this.BACKEND_URL + 'info/edit', infoData)
        .subscribe(response => {
            this.getInfoCustomer();
        });
    }

    // getAvatar(){
    //     return this.UrlAvt;
    // }
}
