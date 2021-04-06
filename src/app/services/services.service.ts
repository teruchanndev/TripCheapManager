import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { Service } from '../modals/service.modal';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })

export class SerivesService {
    private services: Service[] = [];
    private servicesUpdated = new Subject<Service[]>(); 

    constructor(private http: HttpClient, private router: Router) {}

    
}