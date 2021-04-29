import { Component, Inject, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { finalize, map, startWith } from 'rxjs/operators';
import { CategoriesService } from 'src/app/services/categories.service';
import { Category } from 'src/app/modals/category.model';
import { CitiesService } from '../../services/cities.service';
import { City } from '../../modals/city.model';
import { Ticket } from '../../modals/ticket.model';
import { TicketsService } from '../../services/tickets.service';
import { mimeType } from './mime-type.validator';
import { MatChipInputEvent } from '@angular/material/chips';
import { Service } from 'src/app/modals/service.model';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { AngularFireStorage, AngularFireStorageReference } from "@angular/fire/storage";
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-ticket-create',
  templateUrl: './ticket-create.component.html',
  styleUrls: ['./ticket-create.component.css']
})
export class TicketCreateComponent implements OnInit {

  price = 0;
  percent = 0;
  price_reduce = 0;

  downloadURL: Observable<string>;
  storageRef: AngularFireStorageReference;
  arrImage: Array<string> = [];

  categorySelect = '';
  categoryServiceSelect = '';
  listCategoryService: Array<string>;
  // listImage: Array<string> = [];

  ticket: Ticket;
  categories: Category[] = [];
  cities: City[] = [];
  private categoriesSub: Subscription;
  private citiesSub: Subscription;

  formInfo: FormGroup;
  formCategory: FormGroup;
  formService: FormGroup;
  formImage: FormGroup;
  formDone: FormGroup;

  placeholderTime: string;
  services: Service[] = [];

  //services
  isEditable = false;
  isShow = 'none';
  isSelectDay = '';
  isChecked = false;
  addOnBlur = true;
  selectable = true;
  removable = true;
  mode = -1; 

  daySelect : string;
  isSelectDayAct = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  daysAct = ['Từ Thứ 2 - Chủ Nhật', 'Từ Thứ 2 - Thứ 6', 'Thứ 7 - Chủ Nhật', 'Ngày Khác'];

  listImage: Array<File> = [];
  imagePreview = ['', '', '', '', '', '', '', '', '', ''];

  dayChoose = '';

  listIncluded = [];
  listNotInclude = [];
  lisCustomer = [];

  constructor(
    private storage: AngularFireStorage,
    public ticketsService: TicketsService,
    public categoriesService: CategoriesService,
    public citiesService: CitiesService,
    public route: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
  ) { }


  formatDate(date) {
    return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear();
  }

  calPrice_reduce() {
    this.price_reduce = this.price - (this.price * this.percent) / 100;
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
    if(this.mode > 0 ) {
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
    console.log(this.services);
    this.resetFormService();

  }

  remove(service: Service): void {
    const index = this.services.indexOf(service);
    if (index >= 0) {
      this.services.splice(index, 1);
      this.resetFormService();
    }
  }

  ShowServiceItem(i){
    this.resetFormService();
    this.mode = i; 
    if(this.services[i].dayActive.indexOf('and')<0) {
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
      this.lisCustomer = this.services[i].itemService;
      this.listIncluded = this.services[i].included;
      this.listNotInclude = this.services[i].notIncluded;
    } else {
      var pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
      var dateSt = new Date( this.services[i].dayActive.split('and')[0].replace(pattern,'$3-$2-$1'));
      var dateSp = new Date( this.services[i].dayActive.split('and')[1].replace(pattern,'$3-$2-$1'));
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


  changeSelectCategory(value) {
    if ( value === '' ) {
      this.listCategoryService = [];
    } else {
      this.categorySelect = value;
      this.listCategoryService = this.categories
                .find(item => item.name === value).categoryItem;
    }
  }

  getCategoryService(value) {
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

  onUploadImageToFirebase(img) {
    var n = Date.now();
    console.log(img);
    const filePath = `image_upload/${n}`;
    const fileRef = this.storage.ref(filePath);

    return new Promise<any>((resolve, reject) => {
      const task = this.storage.upload(`image_upload/${n}`, img);

        task.snapshotChanges().pipe(
            finalize(() => fileRef.getDownloadURL().subscribe(
                res => resolve(res),
                err => reject(err))
            )
        ).subscribe();
    })
  };

  onSaveTicket() {
    let listUploadImage = [];
    for(const item of this.listImage) {
      listUploadImage.push(this.onUploadImageToFirebase(item));
    }
    Promise.all(listUploadImage).then(values => {
      const ticket = this.ticketsService.addTicket(
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
        values
      ).then((value) => {
        if(value) {
          Swal.fire({
            title: 'Tạo vé thành công',
            icon: 'success'
          }).then(() => {
            this._document.defaultView.location.reload();
          });
        }
      })

      this.formInfo.reset();
      this.formCategory.reset();
      this.formImage.reset();
      this.formService.reset();
      this.formDone.reset();
    });
      
  }

  onPickImage(event: Event, index: number) {
    if(this.imagePreview[index] !== ''){
      this.imagePreview[index] = '';
      this.listImage.splice(index, 1);
    } else {
      const file = (event.target as HTMLInputElement).files[0];
      this.formImage.patchValue({image: file});
      this.formImage.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview[index] = reader.result as string;
        this.listImage.splice(index, 0, this.formImage.value.image);
      };
      reader.readAsDataURL(file);
      console.log('file: '+file.name);
    }
    console.log(this.listImage);
  }

  deleteImage(index: number) {
    this.imagePreview[index] = '';
    this.listImage.splice(index, 1);
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.categoriesSub.unsubscribe();
    this.citiesSub.unsubscribe();
  }

}
