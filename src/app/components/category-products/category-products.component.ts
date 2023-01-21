import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CategoryProductsQueryModel } from '../../query-models/category-products.query-model';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { CategoryProductsCategoryQueryModel } from '../../query-models/category-products-category.query-model';
import { CategoryProductsProductQueryModel } from 'src/app/query-models/category-products-product.query-model';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {
  readonly model$: Observable<CategoryProductsQueryModel> = this._activatedRoute.params.pipe(
    switchMap(
      (params) => combineLatest([
        this._categoryService.getAll(),
        this._productService.getAll()
      ]).pipe(
        map(
          ([categories, products]: [CategoryModel[], ProductModel[]]) => this._mapQueryModel(params['categoryId'], categories, products)
        )
      )
    )
  );

  constructor(private _categoryService: CategoryService, private _activatedRoute: ActivatedRoute, private _productService: ProductService) {
  }

  private _mapQueryModel(categoryId: string, categories: CategoryModel[], products: ProductModel[]): CategoryProductsQueryModel {
    const categoryProducts = products.filter(product => product.categoryId === categoryId);

    const categoriesMap = categories.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, CategoryModel>);

    return {
      category: categoriesMap[categoryId] ? this._mapCategoryToQueryModel(categoriesMap[categoryId]) : undefined,
      categories: categories.map(category => this._mapCategoryToQueryModel(category)),
      products: categoryProducts.map(product => this._mapProductToQueryModel(product, categoriesMap[product.categoryId])),
      productsCount: categoryProducts.length
    }
  }

  private _mapCategoryToQueryModel(category: CategoryModel): CategoryProductsCategoryQueryModel
  {
    return {
      id: category.id,
      name: category.name
    };
  }

  private _mapProductToQueryModel(product: ProductModel, category: CategoryModel): CategoryProductsProductQueryModel
  {
    return {
      id: product.id,
      name: product.name,
      category: this._mapCategoryToQueryModel(category),
      ratingValue: product.ratingValue,
      ratingCount: product.ratingCount,
      price: product.price,
      imageUrl: product.imageUrl
    };
  }
}
