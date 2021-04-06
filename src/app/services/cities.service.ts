import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { City } from '../modals/city.model';

@Injectable({ providedIn: 'root' })

export class CitiesService {
    private cities: City[] = [];
    private citiesUpdated = new Subject<City[]>(); 

    constructor(private http: HttpClient, private router: Router) {}

    getCities(){
        this.http
            .get<{ message: string; cities: any}>('http://localhost:3000/api/city')
            .pipe(
                map( cityData => {
                    return cityData.cities.map(city => {
                        return {
                            id: city._id,
                            name: city.name
                        };
                    });
                })
            )
            .subscribe(transformedCities => {
                this.cities = transformedCities;
                this.citiesUpdated.next([...this.cities]);
            });
    }
    getCategoryUpdateListener() {
        return this.citiesUpdated.asObservable();
    }

    
}