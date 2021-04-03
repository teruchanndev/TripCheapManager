import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "src/environments/environment";
import { User } from "./user.modal";

export class UserService {
    private infoUser: User[] = [];
    private infoUserUpdated = new Subject<User[]>();
    BACKEND_URL = environment.apiURL + '/info/';

    constructor(private http: HttpClient, private router: Router) {}

    getInfoUser() {
        
    }
}