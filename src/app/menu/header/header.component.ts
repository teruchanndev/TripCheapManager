import { variable } from '@angular/compiler/src/output/output_ast';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/modals/user.model';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from '../../services/auth.service';
import { MenuService } from '../../services/menu.service';

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
  imageAvt: String = '';
  user: User;

  constructor(
    private authService: AuthService,
    private router: Router,
    public route: ActivatedRoute,
    private userService: UserService
    ) {}


  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.userId = this.authService.getUserId();
    this.username = this.authService.getUsername();

    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    const info = new Promise((resolve, reject) => {
      this.route.paramMap.subscribe((paramMap: ParamMap) => {
        this.userService.getInfoUser().subscribe(
          infoData => {
            resolve(infoData);
        });
      });
    });
    info.then((value) => {
      const v = value as User;
      this.user = {
        username: v.username,
        nameShop: v.nameShop,
        imageAvt: v.imageAvt,
        imageCover: v.imageCover,
        desShop: v.desShop,
        follower: v.follower,
        watching: v.watching,
        created_at: v.created_at
      };
      this.imageAvt = v.imageAvt;
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
    this.router.navigate(['home', childPath]);
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

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
