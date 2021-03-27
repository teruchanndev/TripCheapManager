import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Category } from 'src/app/categories/category.model';
import { mimeType } from '../ticket-create/mime-type.validator';
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

  form: FormGroup;

  imagePreview: string;

  //mảng categoryItem
  valueItem = [];

  selectedCategory;
  selectedCategoryService;

  price_reduce;
  percent = 0;
  price = 0;

  constructor(
    public ticketsService: TicketsService,
    public categoriesService: CategoriesService,
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
      price: new FormControl(null, {
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
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.ticketId = paramMap.get("ticketId");
      this.ticketsService.getTicket(this.ticketId).subscribe(ticketData => {
        this.ticket = {
          id: ticketData._id,
          title: ticketData.title,
          content: ticketData.content,
          status: ticketData.status,
          price: ticketData.price,
          city: ticketData.city,
          category: ticketData.category,
          categoryService: ticketData.categoryService,
          percent: ticketData.percent,
          price_reduce: ticketData.price_reduce,
          imagePath: ticketData.imagePath
        }
        console.log(this.ticket);
        
        this.form.setValue({
          title: this.ticket.title,
          content: this.ticket.content,
          price : this.ticket.price,
          city : this.ticket.city,
          percent : this.ticket.percent,
          price_reduce : this.ticket.price_reduce,
          image : this.ticket.imagePath
        });

        this.isChecked = ticketData.status;
        this.selectedCategory = this.ticket.category;
        this.selectedCategoryService = this.ticket.categoryService;
        this.valueItem = this.categories.find(
          item => item.name === this.ticket.category
        ).categoryItem;
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
  }

  //function update ticket
  onUpdateTicket(){
    this.ticketsService.updateTickets(
      this.ticketId,
      this.form.value.title,
      this.form.value.content,
      this.isChecked,
      this.form.value.price,
      this.price_reduce,
      this.form.value.percent,
      this.selectedCategory,
      this.selectedCategoryService,
      this.form.value.city
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

  ngOnDestroy(): void{
    this.categoriesSub.unsubscribe();
  }


}
