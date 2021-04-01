import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Category } from 'src/app/categories/category.model';
import { CitiesService } from '../cities.service';
import { City } from '../city.model';
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

  categorySelect = '';
  categoryServiceSelect = '';
  listCategoryService: Array<string>;

  ticket: Ticket;
  categories: Category[] = [];
  cities: City[] = [];
  private categoriesSub: Subscription;
  private citiesSub: Subscription;

  form: FormGroup;
  imagePreview: string;
  isChecked = false;
    

  calPrice_reduce() {
    this.price_reduce = this.price - (this.price * this.percent) / 100;
  }

  changeSelectCategory(value) {
    if ( value === '' ) {
      this.listCategoryService = [];
    } else {
      this.categorySelect = value;
      this.listCategoryService = this.categories
                .find(item => item.name === value).categoryItem;
    }
  }
  
  getCategoryService(value){
    this.categoryServiceSelect = value;
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
    public citiesService: CitiesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {

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
      quantity: new FormControl(null, {}),
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
    
    this.citiesService.getCities();
    this.citiesSub = this.citiesService.getCategoryUpdateListener()
      .subscribe((city: City[]) => {
        this.cities = city;
        console.log(city);
      });
  }

  onSaveTicket() {

      const ticket = this.ticketsService.addTicket(
        this.form.value.title,
        this.form.value.content,
        this.isChecked,
        this.form.value.price_enter,
        this.price_reduce,
        this.form.value.percent,
        this.categorySelect,
        this.categoryServiceSelect,
        this.form.value.city,
        this.form.value.quantity,
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
