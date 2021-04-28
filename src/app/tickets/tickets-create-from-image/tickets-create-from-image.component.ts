import { Component, Inject, OnInit } from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { base64ToFile, Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { createWorker } from 'tesseract.js';
import * as Tesseract from 'tesseract.js';
import { Ticket } from 'src/app/modals/ticket.model';
import { Category } from 'src/app/modals/category.model';
import { City } from 'src/app/modals/city.model';
import { Observable, Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Service } from 'src/app/modals/service.model';
import { TicketsService } from 'src/app/services/tickets.service';
import { CategoriesService } from 'src/app/services/categories.service';
import { CitiesService } from 'src/app/services/cities.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFireStorage, AngularFireStorageReference } from "@angular/fire/storage";
import { finalize } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-tickets-create-from-image',
  templateUrl: './tickets-create-from-image.component.html',
  styleUrls: ['./tickets-create-from-image.component.css']
})
export class TicketsCreateFromImageComponent implements OnInit {


  price = 0;
  percent = 0;
  price_reduce = 0;

  categorySelect = '';
  categoryServiceSelect = '';
  listCategoryService: Array<string>;

  downloadURL: Observable<string>;
  storageRef: AngularFireStorageReference;

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

  daySelect: string;
  isSelectDayAct = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  daysAct = ['Từ Thứ 2 - Chủ Nhật', 'Từ Thứ 2 - Thứ 6', 'Thứ 7 - Chủ Nhật', 'Ngày Khác'];
  listImage: Array<File> = [];
  imagePreview = ['', '', '', '', '', '', '', '', '', ''];
  dayChoose = '';

  listIncluded = [];
  listNotInclude = [];
  lisCustomer = [];

   // services
   isEditable = false;
   isShow = 'none';
   isSelectDay = '';
   isChecked = false;
   addOnBlur = true;
   selectable = true;
   removable = true;
   mode = -1;

  // image/crop/...
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  ocrResult = 'Recognizing...';
  isShowImage = false;


  constructor(
    private storage: AngularFireStorage,
    public ticketsService: TicketsService,
    public categoriesService: CategoriesService,
    public citiesService: CitiesService,
    public route: ActivatedRoute,
    @Inject(DOCUMENT) private _document: Document,
  ) {}

  ngOnInit(): void {
    this.formInfo = new FormGroup({
      title: new FormControl(null, {validators: [Validators.required]}),
      content: new FormControl(null, {validators: [Validators.required]}),
      city: new FormControl(null, {validators: [Validators.required]}),
      address: new FormControl(null, {}),
    });
    this.formCategory = new FormGroup({
      percent: new FormControl(null, {}),
      price_enter: new FormControl(null, {validators: [Validators.required]}),
      price_reduce: new FormControl(null, {validators: [Validators.required]}),
      quantity: new FormControl(null, {}),
    });

    this.formImage = new FormGroup({image: new FormControl(null, {})
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
    setText(id) {
      if(id.type === 'text') {
        id.value = this.ocrResult;
      } else if(id.type === 'number') {
        var x = this.ocrResult.split('.').join('');
        id.value = parseInt(x);
      }

    }

    // FORMAR DATE TO DD/MM/YYYY
    formatDate(date) {
      return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
    }

    // CAL PRICE IS REDUCE
    calPrice_reduce() {
      this.price_reduce = this.price - (this.price * this.percent) / 100;
    }


    isShowFormService() {
      if (this.isShow === 'block') { this.isShow = 'none'; } else { this.isShow = 'block'; }
    }

    // CHECK DATE ACTIVE
    CheckValueDay(event) {
      if (this.daySelect === 'Ngày Khác') {
        this.isSelectDayAct = true;
      } else {
        this.isSelectDayAct = false;
        this.dayChoose = this.daySelect;
      }
    }

    // CHECK RANGER DATE
    checkRangerDate() {
      this.dayChoose = this.formatDate(this.formService.value.dateStart) + 'and' +  this.formatDate(this.formService.value.dateEnd);
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

    // REMOVE SERVICE
    remove(service: Service): void {
      const index = this.services.indexOf(service);
      if (index >= 0) {
        this.services.splice(index, 1);
        this.resetFormService();
      }
    }

    // ADD A SERVICE
    add(): void {
      if (this.mode > 0 ) {
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

    ShowServiceItem(i) {
      this.resetFormService();
      this.mode = i;
      if (this.services[i].dayActive.indexOf('and') < 0) {
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
        const pattern = /(\d{2})\/(\d{2})\/(\d{4})/;
        const dateSt = new Date( this.services[i].dayActive.split('and')[0].replace(pattern, '$3-$2-$1'));
        const dateSp = new Date( this.services[i].dayActive.split('and')[1].replace(pattern, '$3-$2-$1'));
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
      if (include.trim() === '') {
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
      if (notInclude.trim() === '') {
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
      if (title.trim() === '' || price.trim() === '') {
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



    // IMAGE TO TEXT
    async doOCR(base64) {
      const worker = createWorker({
        logger: m => console.log(m),
      });
      await worker.load();
      await worker.loadLanguage('vie+eng');
      await worker.initialize('vie+eng');
      const { data: { text } } = await worker.recognize(base64);
      this.ocrResult = text;
      console.log(text);
      await worker.terminate();
    }

    // FILE CHOOSE UPLOAD CROP
    fileChangeEvent(event: any): void {
      this.isShowImage = true;
      this.imageChangedEvent = event;
    }

    // IMAGE CROP
    imageCropped(event: ImageCroppedEvent) {
      this.croppedImage = event.base64;
      console.log(this.croppedImage);
      console.log(event, base64ToFile(event.base64));

      const image = new Image();
      image.src = this.croppedImage;
      console.log(image);
      this.doOCR(image.src);
    }

    imageLoaded() {
      this.showCropper = true;
      console.log('Image loaded');
    }

    cropperReady(sourceImageDimensions: Dimensions) {
      console.log('Cropper ready', sourceImageDimensions);
    }

    loadImageFailed() {
      console.log('Load failed');
    }

    rotateLeft() {
      this.canvasRotation--;
      this.flipAfterRotate();
    }

    rotateRight() {
      this.canvasRotation++;
      this.flipAfterRotate();
    }

    private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
        ...this.transform,
        flipH: flippedV,
        flipV: flippedH
      };
    }

    flipHorizontal() {
      this.transform = {
        ...this.transform,
        flipH: !this.transform.flipH
      };
    }

    flipVertical() {
      this.transform = {
        ...this.transform,
        flipV: !this.transform.flipV
      };
    }

    resetImage() {
      this.scale = 1;
      this.rotation = 0;
      this.canvasRotation = 0;
      this.transform = {};
    }

    zoomOut() {
      this.scale -= .1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };
    }

    zoomIn() {
      this.scale += .1;
      this.transform = {
        ...this.transform,
        scale: this.scale
      };
    }

    toggleContainWithinAspectRatio() {
      this.containWithinAspectRatio = !this.containWithinAspectRatio;
    }

    updateRotation() {
      this.transform = {
        ...this.transform,
        rotate: this.rotation
      };
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
  

}
