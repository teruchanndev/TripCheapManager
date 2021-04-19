import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Router } from '@angular/router';
import { Category } from '../modals/category.model';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })

export class CategoriesService {
    private categories: Category[] = [];
    private categoriesUpdated = new Subject<Category[]>();
    BACKEND_URL = environment.apiURL + '/categories/';
    constructor(private http: HttpClient, private router: Router) {}

    getCategories() {
        this.http
            .get<{ message: string; category: any}>(this.BACKEND_URL)
            .pipe(
                map( categoryData => {
                    return categoryData.category.map(category => {
                        return {
                            id: category._id,
                            name: category.name,
                            categoryItem: category.categoryItem
                        };
                    });
                })
            )
            .subscribe(transformedCategories => {
                this.categories = transformedCategories;
                this.categoriesUpdated.next([...this.categories]);
            });
    }
    getCategoryUpdateListener() {
        return this.categoriesUpdated.asObservable();
    }


}
