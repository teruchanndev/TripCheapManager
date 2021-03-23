import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../categories.service';
import { Category } from '../category.model';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  categories: Category[] = [];
  private categoriesSub: Subscription;

  constructor(public categoriesService: CategoriesService) { }

  ngOnInit() {
    this.categoriesService.getCategories();
    this.categoriesSub = this.categoriesService.getCategoryUpdateListener()
      .subscribe((category: Category[]) => {
        this.categories = category;
      })
  }

  ngOnDestroy(): void {
    this.categoriesSub.unsubscribe();
  }

}
