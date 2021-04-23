import { Component, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference } from "@angular/fire/storage";

import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  title = "cloudsSorage";
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  storageRef: AngularFireStorageReference;
  constructor(
    private storage: AngularFireStorage
  ) {}
  
  onFileSelected(event) {
    var n = Date.now();
    const file = event.target.files[0];
    console.log(file);
    const filePath = `image_upload/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`image_upload/${n}`, file);
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }

  deleteFromFirebase() {
    console.log(this.downloadURL);
    var fileRef = this.storage.refFromURL("https://firebasestorage.googleapis.com/v0/b/tripcheap-2f380.appspot.com/o/image_upload%2F1619151326971?alt=media&token=aacfe5e0-e783-419e-bb4a-5dfdcedc7a24");
    fileRef.delete().subscribe(function () {
  
      // File deleted successfully
      console.log("File Deleted")
    });
  }

  ngOnInit(): void {
  }


}
