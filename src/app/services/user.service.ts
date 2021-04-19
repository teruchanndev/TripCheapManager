import { HttpClient } from '@angular/common/http';
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
            watching: number
        }>(this.BACKEND_URL + 'info');
    }


    updateInfo(
        nameShop: string,
        iAvt: File | string,
        iCover: File | string,
        desShop: string
    ) {
        let infoData: User | FormData;


            infoData = new FormData();
            infoData.append('nameShop', nameShop);
            if (typeof iAvt === 'string') {
                infoData.append('iAvt', iAvt);
            } else {
                infoData.append('image', iAvt);
            }
            if (typeof iCover === 'string') {
                infoData.append('iCover', iCover);
            } else {
                infoData.append('image', iCover);
            }
            // infoData.append('image', iAvt);
            // infoData.append('image', iCover);
            infoData.append('desShop', desShop);

        console.log(infoData);

        this.http.put(this.BACKEND_URL + 'info/edit', infoData)
        .subscribe(response => {
            this.getInfoUser();
        });
    }

    getAvatar() {
        return this.UrlAvt;
    }
}
