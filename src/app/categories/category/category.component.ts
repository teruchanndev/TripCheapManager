import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../modals/category.model';

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
      });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngOnDestroy(): void {
    this.categoriesSub.unsubscribe();
  }

}
