import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-info',
  templateUrl: './create-info.component.html',
  styleUrls: ['./create-info.component.css']
})
export class CreateInfoComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;

  imagePreview = '';
  imageStorage: File;

  imagePreviewAvt = '';
  imageAvtStorage: File;

  form: FormGroup;
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.username = this.authService.getUsername();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });

    this.form = new FormGroup({
      nameShop: new FormControl(null, {
      }),
      imageCover: new FormControl(null, {
      }),
      imageAvatar: new FormControl(null, {
      }),
      desShop: new FormControl(null, {})
    })
  }
  onPickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    console.log(file);
    this.form.patchValue({imageCover: file});
    this.form.get('imageCover').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.imageStorage = this.form.value.imageCover;
    };
    reader.readAsDataURL(file);
    console.log(this.imagePreview);
    console.log(this.imageStorage);
    
  }

  onPickImageAvt(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({imageAvatar: file});
    this.form.get('imageAvatar').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewAvt = reader.result as string;
      this.imageAvtStorage = this.form.value.imageAvatar;
    };
    reader.readAsDataURL(file);
  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }

}
