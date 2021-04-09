import { Component, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/modals/category.model';
import { CitiesService } from '../../services/cities.service';
import { City } from '../../modals/city.model';
import { mimeType } from '../ticket-create/mime-type.validator';
import { Ticket } from '../../modals/ticket.model';
import { TicketsService } from '../../services/tickets.service';
import { Service } from 'src/app/modals/service.modal';


@Component({
  selector: 'app-ticket-edit',
  templateUrl: './ticket-edit.component.html',
  styleUrls: ['./ticket-edit.component.css']
})
export class TicketEditComponent implements OnInit {

  price_reduce = 0;
  percent = 0;
  price = 0;

  private ticketId: string;
  private creator: string;
  ticket: Ticket;
  isChecked: boolean; //check status true hay false => set checked slide toggle

  categories: Category[] = [];
  cities: City[] = [];
  private categoriesSub: Subscription;
  private citiesSub: Subscription;

  formInfo: FormGroup;
  formCategory: FormGroup;
  formService: FormGroup;
  formImage: FormGroup;
  formDone: FormGroup;

  //mảng categoryItem
  valueItem = [];
  categorySelect;
  categoryServiceSelect;
  
  listImage: Array<File> = [];
  imageUrls: Array<string> = [];
  imagePreview = ['', '', '', '', '', '', '', '', '', ''];

  placeholderTime: string;
  services: Service[] = [];

  //services
  isEditable = true;
  isShow = 'block';
  isSelectDay = '';
  addOnBlur = true;
  selectable = true;
  removable = true;
  mode = -1; 

  daySelect : string;
  isSelectDayAct = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  daysAct = ['Từ Thứ 2 - Chủ Nhật', 'Từ Thứ 2 - Thứ 6', 'Thứ 7 - Chủ Nhật', 'Ngày Khác'];

  dayChoose = '';

  listIncluded = [];
  listNotInclude = [];
  lisCustomer = [];

  constructor(
    public ticketsService: TicketsService,
    public categoriesService: CategoriesService,
    public citiesService: CitiesService,
    public route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.formInfo = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required]
      }),
      content: new FormControl(null, {
        validators: [Validators.required]
      }),
      city: new FormControl(null, {
        validators: [Validators.required]
      }),
      address: new FormControl(null, {
      }),
    });


    this.formCategory = new FormGroup({
      percent: new FormControl(null, {}),
      price_enter: new FormControl(null, {
        validators: [Validators.required]
      }),
      price_reduce: new FormControl(null, {
        validators: [Validators.required]
      }),
      quantity: new FormControl(null, {
      }),
    });

    this.formImage = new FormGroup({
      image: new FormControl(null, {
      })
    });

    this.formService = new FormGroup({
      name: new FormControl(null, {}),
      timeStart: new FormControl(null, {}),
      timeStop: new FormControl(null, {}),
      dayActive: new FormControl(null, {}),
      dateStart: new FormControl(null, {}), 
      dateEnd: new FormControl(null, {}),
      included: new FormControl(null, {}),
      notIncluded: new FormControl(null, {}),
      customerTitle: new FormControl(null, {}),
      customerPrice: new FormControl(null, {})
    });

    this.formDone = new FormGroup({
      check: new FormControl(null, {})
    });
    
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log(paramMap);
      this.ticketId = paramMap.get("ticketId");
      this.categoriesService.getCategories();
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
          address: ticketData.address,
          services: ticketData.services,
          imagePath: ticketData.imagePath
        }

        console.log(this.ticket);
        
        this.formInfo.setValue({
          title: this.ticket.title,
          content: this.ticket.content,
          city : this.ticket.city,
          address : this.ticket.address
        });

        this.formCategory.setValue({
          percent: this.ticket.percent,
          price_enter: this.ticket.price,
          price_reduce: this.ticket.price_reduce,
          quantity: this.ticket.quantity
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
        this.services = this.ticket.services[0] as Array<Service>;
        console.log(this.services);
        // console.log(this.imagePreview);

        const app = this;
        setTimeout(function(){
          app.valueItem = app.categories.find(
            item => item.name === app.ticket.category
          ).categoryItem;
        }, 2000);
        
      });
    });
    this.categoriesSub = this.categoriesService.getCategoryUpdateListener()
      .subscribe((category: Category[]) => {
        this.categories = category;
        this.valueItem = this.categories.find(
          item => item.name === this.ticket.category
        ).categoryItem;
      });
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
      this.formInfo.value.title,
      this.formInfo.value.content,
      this.isChecked,
      this.formCategory.value.price_enter,
      this.price_reduce,
      this.formCategory.value.percent,
      this.categorySelect,
      this.categoryServiceSelect,
      this.formInfo.value.city,
      this.formCategory.value.quantity,
      this.formInfo.value.address,
      this.services,
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
      this.formImage.patchValue({image: file});
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
    this.imageUrls[index] = '';
  }

  formatDate(date) {
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
  }

  isShowFormService(){
    if(this.isShow === 'block') this.isShow = 'none';
    else this.isShow = 'block';
  }

  CheckValueDay(event) {
    if(this.daySelect === 'Ngày Khác') {
      this.isSelectDayAct = true;
    } else {
      this.isSelectDayAct = false;
      this.dayChoose = this.daySelect;
    }
  }

  checkRangerDate() {

    this.dayChoose = this.formatDate(this.formService.value.dateStart) + "and" +  this.formatDate(this.formService.value.dateEnd);
    console.log(this.dayChoose);
  }

  resetFormService() {
    this.formService.setValue({
      name: '',
      timeStart: '' ,
      timeStop: '' ,
      dayActive: '' ,
      dateStart: '' ,
      dateEnd: '' ,
      included: '',
      notIncluded: '',
      customerTitle: '',
      customerPrice: ''
    });
    this.lisCustomer = [];
    this.listIncluded = [];
    this.listNotInclude = [];
  }

  add(): void {
    console.log(this.mode);
    if(this.mode >= 0 ) {
      this.remove(this.services[this.mode]);
    }
    this.services.push(
      {
        name: this.formService.value.name.trim(), 
        timeStart: this.formService.value.timeStart,
        timeStop:  this.formService.value.timeStop,
        dayActive: this.dayChoose,
        included: this.listIncluded || [],
        notIncluded: this.listNotInclude || [],
        itemService: this.lisCustomer || []
      });
    this.resetFormService();

  }

  remove(service: Service): void {
    const index = this.services.indexOf(service);
    if (index >= 0) {
      this.services.splice(index, 1);
    }
  }

  ShowServiceItem(i){
    this.resetFormService();
    console.log(this.services);
    this.mode = i; 
    console.log(this.services[i].dayActive);
    if(typeof this.services[i].dayActive !== 'undefined' && this.services[i].dayActive.indexOf('and')<0) {
      this.formService.setValue({
        name: this.services[i].name,
        timeStart: this.services[i].timeStart ,
        timeStop: this.services[i].timeStop ,
        dayActive: this.services[i].dayActive,
        dateStart: '' ,
        dateEnd: '' ,
        included: '',
        notIncluded: '',
        customerTitle: '',
        customerPrice: ''
      });
      this.daySelect = this.services[i].dayActive;
      this.isSelectDayAct = false;
      this.lisCustomer = this.services[i].itemService;
      this.listIncluded = this.services[i].included;
      this.listNotInclude = this.services[i].notIncluded;
    } else {
      var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      var dateSt = new Date( this.services[i].dayActive.split('and')[0].replace(pattern,'$3-$2-$1'));
      var dateSp = new Date( this.services[i].dayActive.split('and')[1].replace(pattern,'$3-$2-$1'));
      
      console.log(dateSp, dateSt);
      this.formService.setValue({
        name: this.services[i].name,
        timeStart: this.services[i].timeStart ,
        timeStop: this.services[i].timeStop ,
        dayActive: this.daysAct[3] ,
        dateStart: dateSt,
        dateEnd: dateSp,
        included: '',
        notIncluded: '',
        customerTitle: '',
        customerPrice: ''
      });
      this.daySelect = this.daysAct[3];
      this.isSelectDayAct = true;
      this.lisCustomer = this.services[i].itemService;
      this.listIncluded = this.services[i].included;
      this.listNotInclude = this.services[i].notIncluded;
    }
  }

  addInclude(include) {
    if(include.trim() === ''){
      this.formService.patchValue({
        included: '' 
      });
      return;
    }
    this.listIncluded.push(include);
    this.formService.patchValue({
      included: '' 
    });
  }

  removeIncluded(include, i) {
    this.listIncluded.splice(i, 1);
  }

  addNotInclude(notInclude) {
    if(notInclude.trim() === ''){
      this.formService.patchValue({
        notIncluded: '' 
      });
      return;
    }
    this.listNotInclude.push(notInclude);
    this.formService.patchValue({
      notIncluded: '' 
    });
  }

  removeNotIncluded(notInclude, i) {
    this.listNotInclude.splice(i, 1);
  }

  addCustomer(title, price) {
    if(title.trim() === '' || price.trim() === ''){
      this.formService.patchValue({
        customerTitle: '',
        customerPrice: ''
      });
      return;
    }
    this.lisCustomer.push(
      { name: title,
        price: price}
    );
    this.formService.patchValue({
      customerTitle: '',
      customerPrice: ''
    });
  }

  removeCustomer(i) {
    this.lisCustomer.splice(i, 1);
  }

  ngOnDestroy(): void{
    this.categoriesSub.unsubscribe();
  }

}
