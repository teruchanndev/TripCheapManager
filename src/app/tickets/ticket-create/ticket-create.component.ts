import { SelectionModel } from '@angular/cdk/collections';
import { flatten } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { MatListOption, MatSelectionList } from '@angular/material/list';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Category } from 'src/app/categories/category.model';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {

  price = 0;
  percent = 0;
  price_reduce = 0;
  selectItem = '';
  valueItemSelect = '';
  valueItem: Array<string>;

  ticket: Ticket;
  categories: Category[] = [];
  private categoriesSub: Subscription;

  form: FormGroup;
  imagePreview: string;
  isChecked = false;

  @ViewChild(MatSelectionList, {static: true}) private selectionList: MatSelectionList;
    

  calPrice_reduce() {
    this.price_reduce = this.price - (this.price * this.percent) / 100;
  }

  changeSelectCategory(value) {
    if ( value === '' ) {
      this.valueItem = [];
    } else {
      this.valueItem = this.categories
                .find(item => item.name === value).categoryItem;
    }
  }

  checkStt() {
    if (this.isChecked) {
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
    console.log(this.isChecked);
  }

  constructor(
    public ticketsService: TicketsService,
    public categoriesService: CategoriesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
    
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      city: new FormControl(null, {
        validators: [Validators.required]
      }),
      percent: new FormControl(null, {}),
      price_enter: new FormControl(null, {
        validators: [Validators.required]
      }),
      price_reduce: new FormControl(null, {
        validators: [Validators.required]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });

    this.categoriesService.getCategories();
    this.categoriesSub = this.categoriesService.getCategoryUpdateListener()
      .subscribe((category: Category[]) => {
        this.categories = category;
      });
    console.log(this.categories);
  }

  onSaveTicket() {

      const ticket = this.ticketsService.addTicket(
        this.form.value.title,
        this.form.value.content,
        this.isChecked,
        this.form.value.price_enter,
        this.price_reduce,
        this.form.value.percent,
        this.selectItem,
        this.valueItemSelect,
        this.form.value.city,
        this.form.value.image
      );

      this.form.reset();
  }

  onPickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.categoriesSub.unsubscribe();
  }

}
