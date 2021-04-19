import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { mimeType } from '../../tickets/ticket-create/mime-type.validator';
import { User } from '../../modals/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  private infoUserSub: Subscription;
  userIsAuthenticated = false;
  username: string;
  createdAt: string;

  user: User;

  imagePreview = '';
  imageStorage: File;

  imagePreviewAvt = '';
  imageAvtStorage: File;

  form: FormGroup;
  constructor(
    private authService: AuthService,
    public route: ActivatedRoute,
    private userService: UserService
  ) { }
  
  ngOnInit(): void {

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getUsername();
    this.createdAt = this.authService.getCreatedAt();
    console.log(this.createdAt);
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
            watching: infoData.watching
          }
          console.log(this.user);

          this.form.setValue({
            nameShop: this.user.nameShop || '',
            imageCover: this.user.imageCover,
            imageAvt: this.user.imageAvt,
            desShop: this.user.desShop || ''
          });

          this.imagePreviewAvt = this.user.imageAvt;
          this.imagePreview = this.user.imageCover;
      });
    })
  }

  onSaveInfo(){
    console.log(this.form.value);
    this.userService.updateInfo(
      this.form.value.nameShop,
      this.form.value.imageAvt,
      this.form.value.imageCover,
      this.form.value.desShop
    );
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

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}
