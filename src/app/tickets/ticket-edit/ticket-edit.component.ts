import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/categories/categories.service';
import { Category } from 'src/app/categories/category.model';
import { CitiesService } from '../cities.service';
import { City } from '../city.model';
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
  private creator: string;
  ticket: Ticket;
  isChecked: boolean; //check status true hay false => set checked slide toggle

  categories: Category[] = [];
  cities: City[] = [];
  private categoriesSub: Subscription;
  private citiesSub: Subscription;

  form: FormGroup;

  //mảng categoryItem
  valueItem = [];
  categorySelect;
  categoryServiceSelect;

  price_reduce = 0;
  percent = 0;
  price = 0;

  listImage: Array<File> = [];
  imageUrls: Array<string> = [];
  imagePreview = ['', '', '', '', '', '', '', '', '', ''];

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
      quantity: new FormControl(null, {
        validators: [Validators.required]
      }),
      // image: new FormControl(null, {

      // })
    });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);
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
          quantity: ticketData.quantity,
          imagePath: ticketData.imagePath
        }
        console.log(this.ticket);
        
        this.form.setValue({
          title: this.ticket.title,
          content: this.ticket.content,
          price_enter : this.ticket.price,
          city : this.ticket.city,
          percent : this.ticket.percent,
          price_reduce : this.ticket.price_reduce,
          quantity : this.ticket.quantity
        });

        this.isChecked = ticketData.status;
        this.categorySelect = this.ticket.category;
        this.categoryServiceSelect = this.ticket.categoryService;
        for(let i = 0; i< 10; i++){
          if(this.ticket.imagePath[i]){
            this.imagePreview[i] = this.ticket.imagePath[i];
            this.imageUrls[i] = this.ticket.imagePath[i];
          }
        }
        console.log(this.imagePreview);

        const app = this;
        setTimeout(function(){
          app.valueItem = app.categories.find(
            item => item.name === app.ticket.category
          ).categoryItem;
        }, 2000)
        
        console.log(this.categoryServiceSelect);
        console.log(this.valueItem);
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

  getCategoryService(value) {
    this.categoryServiceSelect = value;
  }

  //show categoryItem with category name
  changeSelectCategory(value){
    if ( value === '' ) {
      this.categorySelect = '';
      this.valueItem = [];
    } else {
      this.categorySelect = '';
      this.categoryServiceSelect = '';
      this.valueItem = this.categories
                .find(item => item.name === value).categoryItem;
    }
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
      this.categorySelect,
      this.categoryServiceSelect,
      this.form.value.city,
      this.form.value.quantity,
      this.imageUrls,
      this.listImage
    );
  }

  
  onPickImage(event: Event, index: number) {

    if(this.imagePreview[index] !== ''){
      this.imageUrls[index] = '';
      this.imagePreview[index] = '';
      this.listImage.splice(index, 1);
    } else {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      // this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview[index] = reader.result as string;
        this.listImage.splice(index, 0, file);
      };
      reader.readAsDataURL(file);
    }
    console.log(this.imagePreview);
    console.log(this.listImage);
  }

  deleteImage(index: number) {
    this.imagePreview[index] = '';
  }

  ngOnDestroy(): void{
    this.categoriesSub.unsubscribe();
  }


}
