import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';

import { Email } from '../modals/email.model';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { stringify } from '@angular/compiler/src/util';
import { ServiceSelect } from '../modals/serviceSelect.model';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private email: Email;
  BACKEND_URL = environment.apiURL + '/email/';

  constructor(
    private http: HttpClient,
    private router: Router) {}

  sendEmail(
    to: string,
    from: string,
    subject: string,
    text: string,
    html: string
  ) {
    // tslint:disable-next-line:prefer-const
    let emailData: Email | FormData;
    
    emailData = {
        to: to,
        from: from,
        subject: subject,
        text: text,
        html: html
    };
    console.log(emailData);
    this.http
      .post<
        { message: string; email: Email }>
        (this.BACKEND_URL + 'send', emailData)
      .subscribe(responseData => {
        console.log(responseData);
      });
        console.log(emailData);
    return emailData;
  }

}
