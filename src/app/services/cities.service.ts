import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { City } from '../modals/city.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class CitiesService {
    private cities: City[] = [];
    private citiesUpdated = new Subject<City[]>();
    BACKEND_URL = environment.apiURL + '/city/';
    constructor(private http: HttpClient, private router: Router) {}

    getCities() {
        this.http
            .get<{ message: string; cities: any}>(this.BACKEND_URL)
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
