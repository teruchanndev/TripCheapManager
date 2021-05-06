import { HttpClient } from '@angular/common/http';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../modals/user.model';


@Injectable({ providedIn: 'root' })

export class UserService {
    private infoUser: User[] = [];
    private infoUserUpdated = new Subject<User[]>();
    BACKEND_URL = environment.apiURL + '/user/';

    UrlAvt: string;

    constructor(private http: HttpClient, private router: Router) {}

    getInfoUser() {
        return this.http.get<{
            username: string,
            nameShop: string,
            imageAvt: string,
            imageCover: string,
            desShop: string,
            follower: number,
            watching: number,
            created_at: Date
        }>(this.BACKEND_URL + 'info');
    }


    updateInfo(
        nameShop: string,
        iAvt: File | string,
        iCover: File | string,
        desShop: string
    ) {
        return new Promise((resolve) => {
            let infoData: Object;
            infoData = {
                nameShop: nameShop,
                iAvt: iAvt,
                iCover: iCover,
                desShop: desShop
            }
            console.log(infoData);
    
            this.http.put(this.BACKEND_URL + 'info/edit', infoData)
            .subscribe(response => {
                resolve(true);
                // this.getInfoUser();
            });
        });
        
    }

    getAvatar() {
        return this.UrlAvt;
    }


}
