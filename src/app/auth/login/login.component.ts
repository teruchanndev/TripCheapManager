import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService) { }

  ngOnInit() {

  }

  onLogin(form: NgForm) {
    if (form.invalid) { return; }
    this.authService.login(form.value.email, form.value.password);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    // this.authStatusSub.unsubscribe();
  }

}
