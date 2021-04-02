import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  valueSidebar = false;

  isExpanded = true;
  showSubmenu = false;
  isShowing = false;
  showSubSubMenu = false;
  userId: string;
  username: string;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUsername();
    console.log(this.username);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  // tslint:disable-next-line:member-ordering
  @ViewChild('sidenav') sidenav: any;
  toggleSidenav() {
      this.sidenav.toggle(true);
    }

  showChild(childPath) {
    this.router.navigate(['', childPath]);
  }

  mouseenter() {
    if (!this.isExpanded) {
      this.isShowing = true;
    }
  }

  mouseleave() {
    if (!this.isExpanded) {
      this.isShowing = false;
    }
  }
}
