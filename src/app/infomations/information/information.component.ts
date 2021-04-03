import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { mimeType } from '../../tickets/ticket-create/mime-type.validator';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit, OnDestroy {

  private authListenerSubs: Subscription;
  userIsAuthenticated = false;
  username: string;
  createdAt: string;

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
      imageAvatar: new FormControl(null, {
      }),
      desShop: new FormControl(null, {})
    })
  }

  onSaveInfo(){
    
  }

  onPickImage(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
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
