import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from '../modals/auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {

    BACKEND_URL = environment.apiURL + '/user/';
    private token: String;
    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false;
    private tokenTimer: any;
    private userId: string;
    private username: string;
    private created_at: string;

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
        return this.token;
    }

    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }
    getIsAuth() {
      return this.isAuthenticated;
    }
    getUserId() {
      return this.userId;
    }

    getUsername() {
      return this.username;
    }

    getCreatedAt() {
      return this.created_at;
    }

    createUser(email: string, password: string, username: string) {
        const authData: AuthData = {email: email, password: password, username: username, created_at: ''};
        this.http.post(this.BACKEND_URL + 'signup', authData)
            .subscribe(() => {
              this.router.navigate(['/login']);
            }, error => {
              this.authStatusListener.next(false);
            });
    }

    login(email: string, password: string) {
        const authData: AuthData = {email: email, password: password, username: '', created_at: ''};
        console.log(authData);
        this.http.post<{token: string, expiresIn: number, userId: string, username: string, created_at: string }>(
          this.BACKEND_URL + 'login',
          authData
          )
            .subscribe(response => {
                console.log('res: ' + response.created_at);
                const token = response.token;
                this.token = token;
                if (token) {
                  const expiresInDuration = response.expiresIn;
                  this.setAuthTimer(expiresInDuration);
                  this.isAuthenticated = true;
                  this.userId = response.userId;
                  this.username = response.username;
                  this.created_at = response.created_at;
                  this.authStatusListener.next(true);
                  const now = new Date();
                  const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
                  console.log(expirationDate);
                  this.saveAuthData(token, expirationDate, this.userId, this.username, this.created_at);
                  this.router.navigate(['/home']);
                }
            }, error => {
              console.log('error ' + authData);
              this.authStatusListener.next(false);
            });
    }

    autoAuthUser() {
      const authInformation = this.getAuthData();
      if (!authInformation) { return; }
      const now = new Date();
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

      if (expiresIn > 0) {
        this.token = authInformation.token;
        this.isAuthenticated = true;
        this.userId = authInformation.userId;
        this.username = authInformation.username;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }

    logout() {
      this.token = null;
      this.isAuthenticated = false;
      this.authStatusListener.next(false);
      this.userId = null;
      clearTimeout(this.tokenTimer);
      this.clearAuthData();
      this.router.navigate(['/login']);

    }

    private setAuthTimer(duration: number) {
      console.log('setting timer: ' + duration);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string, username: string, created_at: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('userId', userId);
      localStorage.setItem('username', username);
      localStorage.setItem('created_at', created_at);
    }

    private clearAuthData() {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
    }

    private getAuthData() {
      const token  = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expiration');
      const userId = localStorage.getItem('userId');
      const username = localStorage.getItem('username');
      const created_at = localStorage.getItem('created_at');
      if (!token || !expirationDate) {
        return;
      }
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId,
        username: username,
        created_at: created_at
      };
    }
}
