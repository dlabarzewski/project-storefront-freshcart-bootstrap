import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, switchMap } from 'rxjs';
import { CategoryProductsCategoryQueryModel } from 'src/app/query-models/category-products-category.query-model';
import { CategoryProductsQueryModel } from 'src/app/query-models/category-products.query-model';
import { CategoryModel } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {
  readonly categories$: Observable<CategoryModel[]> = this._categoryService.getAll();

  readonly model$: Observable<CategoryProductsQueryModel> = this._activatedRoute.params.pipe(
    switchMap(
      (params) => combineLatest([
        this._categoryService.getAll()
      ]).pipe(
        map(
          ([categories]: [CategoryModel[]]) => this._mapQueryModel(params['categoryId'], categories)
        )
      )
    )
  );

  constructor(private _categoryService: CategoryService, private _activatedRoute: ActivatedRoute) {
  }

  private _mapQueryModel(categoryId: string, categories: CategoryModel[]): CategoryProductsQueryModel {
    const currentCategory: CategoryModel|undefined = categories.find((cat: CategoryModel) => cat.id === categoryId);

    let mappedCategory: CategoryProductsCategoryQueryModel|undefined = undefined;

    if (currentCategory) {
      mappedCategory = {
        id: currentCategory.id,
        name: currentCategory.name
      }
    }

    return {
      category: mappedCategory,
      categories: categories.map(category => ({
        id: category.id,
        name: category.name
      }))
    }
  }
}
