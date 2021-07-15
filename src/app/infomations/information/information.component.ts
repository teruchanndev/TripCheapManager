import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { mimeType } from '../../tickets/ticket-create/mime-type.validator';
import { User } from '../../modals/user.model';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { AngularFireStorage, AngularFireStorageReference } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  private infoUserSub: Subscription;
  showChangePass = false;

  userIsAuthenticated = false;
  username: string;
  createdAt: string;
  userId: string;

  user: User;
  downloadURL: Observable<string>;
  storageRef: AngularFireStorageReference;

  imagePreview = '';
  imageStorage: File;

  imagePreviewAvt = '';
  imageAvtStorage: File;

  form: FormGroup;
  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService,
    public route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    @Inject(DOCUMENT) private _document: Document
  ) { }
  
  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getUsername();
    this.userId = this.authService.getUserId();
    // this.createdAt =  new Date(this.authService.getCreatedAt());
    // console.log('createDate: ', this.createdAt);
    // console.log('dateString: ', this.authService.getCreatedAt());
    // console.log(this.createdAt);
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      nameShop: new FormControl(null, {
        validators: [Validators.required]
      }),
      imageCover: new FormControl(null, {
      }),
      imageAvt: new FormControl(null, {
      }),
      desShop: new FormControl(null, {})
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.userService.getInfoUser().subscribe(
        infoData => {
          this.user = {
            username: infoData.username,
            nameShop: infoData.nameShop,
            imageAvt: infoData.imageAvt,
            imageCover: infoData.imageCover,
            desShop: infoData.desShop,
            follower: infoData.follower,
            watching: infoData.watching,
            created_at: infoData.created_at
          }
          // console.log(this.user);

          this.form.setValue({
            nameShop: this.user.nameShop || '',
            imageCover: this.user.imageCover,
            imageAvt: this.user.imageAvt,
            desShop: this.user.desShop || ''
          });
          var daycreate = new Date(infoData.created_at);
          this.createdAt = daycreate.getUTCDate() + '/' + daycreate.getUTCMonth() + '/' + daycreate.getUTCFullYear();
          this.imagePreviewAvt = this.user.imageAvt;
          this.imagePreview = this.user.imageCover;
      });
    })
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

  onSaveInfo(){
    console.log(this.imagePreview);
    console.log(this.form.value);
    var imageAvtUploaded;
    var imageCoverUploaded;

    if(this.imagePreviewAvt.substr(0,4) === 'data' && this.imagePreview.substr(0,4) !== 'data') {
      imageAvtUploaded = this.onUploadImageToFirebase(this.imageAvtStorage).then((result) => {
        this.userService.updateInfo(
          this.form.value.nameShop,
          result,
          this.imagePreview,
          this.form.value.desShop
        ).then((resovel) => {
          Swal.fire({
            title: 'Sửa thông tin thành công!',
            icon: 'success'
          }).then(() => { this._document.defaultView.location.reload(); });
        });
      });

    }
    else if(this.imagePreview.substr(0,4) === 'data' && this.imagePreviewAvt.substr(0,4) !== 'data') {
      imageCoverUploaded = this.onUploadImageToFirebase(this.imageStorage).then((result) => {
        this.userService.updateInfo(
          this.form.value.nameShop,
          this.imagePreviewAvt,
          result,
          this.form.value.desShop
        ).then((resovel) => {
          Swal.fire({
            title: 'Sửa thông tin thành công!',
            icon: 'success'
          }).then(() => { this._document.defaultView.location.reload(); });
        });
      });
      
      
    }
    else if(this.imagePreview.substr(0,4) === 'data' && this.imagePreviewAvt.substr(0,4) === 'data') {
      imageAvtUploaded = this.onUploadImageToFirebase(this.imageAvtStorage);
      imageCoverUploaded = this.onUploadImageToFirebase(this.imageStorage);
      Promise.all([imageAvtUploaded, imageCoverUploaded]).then((result) => {
        console.log('result',result);
        this.userService.updateInfo(
          this.form.value.nameShop,
          result[0],
          result[1],
          this.form.value.desShop
        ).then((resovel) => {
          Swal.fire({
            title: 'Sửa thông tin thành công!',
            icon: 'success'
          }).then(() => { this._document.defaultView.location.reload(); });
        });
      });

    }
    else if(this.imagePreview.substr(0,4) !== 'data' && this.imagePreviewAvt.substr(0,4) !== 'data') {
      this.userService.updateInfo(
        this.form.value.nameShop,
        this.imagePreviewAvt,
        this.imagePreview,
        this.form.value.desShop
      ).then((resovel) => {
        Swal.fire({
          title: 'Sửa thông tin thành công!',
          icon: 'success'
        }).then(() => { this._document.defaultView.location.reload(); });
      });
    }

  }

  onPickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({imageCover: file});
    this.form.get('imageCover').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      // console.log(reader.result);
      this.imageStorage = this.form.value.imageCover;
    };
    reader.readAsDataURL(file);
  }

  onPickImageAvt(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({imageAvt: file});
    this.form.get('imageAvt').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewAvt = reader.result as string;
      this.imageAvtStorage = this.form.value.imageAvt;
      console.log(this.imageAvtStorage);
    };
    reader.readAsDataURL(file);
  }

  chagePassword(form: NgForm) {

    if (form.invalid) { return; }
    if(form.value.passwordChange !== form.value.rePasswordChange) {
      Swal.fire({
        title: 'Mật khẩu không trùng khớp!',
        icon: 'error'
      });
    } else {
      this.authService.chagePassword(form.value.passwordChange).then(
        (result) => {
          if(result) {
            Swal.fire({
              title: 'Bạn đã thay đổi mật khẩu thành công! Vui lòng đăng nhập lại!',
              icon: 'success'
            }).then(() => {
              this.router.navigate(['/login']);
            });
          } else {
            Swal.fire({
              title: 'Thay đổi mật khẩu thất bại! Vui lòng kiểm tra lại!',
              icon: 'error'
            }).then(() => {
              // this.router.navigate(['/login']);
            });
          }
        });
    }
    
  }

  cancelChangePass() {
    this.showChangePass = false;
  }

  deleteAccount() {
    Swal.fire({
      title: 'Bạn có muốn xóa tài khoản không?',
      icon: 'question',
      showCancelButton: true
    }).then((result) => {
      if(result.isConfirmed) {
        console.log('customerId: ', this.userId);
        this.authService.deleteAccount(this.userId).then(() => {
          Swal.fire({
            title: 'Bạn đã xóa thành công!',
            icon: 'success'
          }).then(() => {
            this.router.navigate(['home']);
          })
        });
      } else {

      }
    })
  }
  

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}
