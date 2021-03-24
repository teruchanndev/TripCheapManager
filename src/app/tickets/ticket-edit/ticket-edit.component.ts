import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Category } from 'src/app/categories/category.model';
import { Ticket } from '../ticket.model';
import { TicketsService } from '../tickets.service';


@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.css']
})
export class TicketEditComponent implements OnInit {

  private ticketId: string;
  ticket: Ticket;
  isChecked: boolean; //check status true hay false => set checked slide toggle

  categories: Category[] = [];
  private categoriesSub: Subscription;

  price_reduce;
  selectItem;
  valueItem = [];

  selectedCategory;
  selectedCategoryService;
  percent = 0;
  price = 0;

  constructor(
    public ticketsService: TicketsService,
    public categoriesService: CategoriesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ticketId = paramMap.get("ticketId");
      this.ticketsService.getTicket(this.ticketId).subscribe(ticketData => {
        this.ticket = {id: ticketData._id,
                       title: ticketData.title,
                       content: ticketData.content,
                       status: ticketData.status,
                       price: ticketData.price,
                       city: ticketData.city,
                       category: ticketData.category,
                       categoryService: ticketData.categoryService,
                       percent: ticketData.percent,
                       price_reduce: ticketData.price_reduce};
        console.log(ticketData);
        this.isChecked = ticketData.status;
        this.selectedCategory = ticketData.category;
        this.selectedCategoryService = ticketData.categoryService;
        this.valueItem = this.categories
        .find(item => item.name === ticketData.category).categoryItem;
      });
    });

    this.categoriesService.getCategories();
    this.categoriesSub = this.categoriesService.getCategoryUpdateListener()
      .subscribe((category: Category[]) => {
        this.categories = category;
      })
  }

  //check value status
  checkStt(){
    if(this.isChecked){
      this.isChecked = false;
    } else {
      this.isChecked = true;
    }
    console.log(this.isChecked);
  }

  //calculator price reduce
  calPrice_reduce(){
      this.price_reduce = this.price - (this.price * this.percent) / 100;
      console.log(this.price);
      console.log(this.percent);
      console.log(this.price_reduce);
  }

  //function update ticket
  onUpdateTicket(form: NgForm){
    this.ticketsService.updateTickets(
      this.ticketId,
      form.value.title,
      form.value.content,
      this.isChecked,
      form.value.price,
      this.price_reduce,
      form.value.percent,
      this.selectedCategory,
      this.selectedCategoryService,
      form.value.city
    );
  }

  //show categoryItem with category name
  changeSelectCategory(value){
    if ( value === '' ) {
      this.valueItem = [];
    } else {
      this.valueItem = this.categories
                .find(item => item.name === value).categoryItem;
    }
  }

  ngOnDestroy(): void{
    this.categoriesSub.unsubscribe();
  }


}
