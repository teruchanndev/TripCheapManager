import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MenuService } from '../menu.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {

  //constructor() { }
  private valueCallSidebarSubscription: Subscription;
  options: FormGroup;
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));
  valueCallSidebar: boolean;

  constructor(fb: FormBuilder, private menuService: MenuService) {
    this.options = fb.group({
      bottom: 0,
      fixed: false,
      top: 0
    });
  }

  ngOnInit() {
    this.valueCallSidebarSubscription = this.menuService
      .getValueOpenSidebar()
      .subscribe(data => {
        this.valueCallSidebar = data;
        console.log(data);
      });
  }


  ngOnDestroy(): void {
    this.valueCallSidebarSubscription.unsubscribe();
  }

}
