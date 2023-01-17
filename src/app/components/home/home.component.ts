import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeQueryModel } from '../../query-models/home.query-model';
import { CategoryModel } from '../../models/category.model';
import { StoreModel } from '../../models/store.model';
import { ProductModel } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { CategoryId } from 'src/app/statics/category-id.static';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private featuredCategoriesIds: string[] = [CategoryId.fruitsAndVegetables, CategoryId.snackAndMunchies];

  readonly model$: Observable<HomeQueryModel> = combineLatest([
    this._categoryService.getAll(),
    this._storeService.getAllWithTags(),
    this._productService.getAll()
  ]).pipe(
    map(
      ([categories, stores, products]: [CategoryModel[], StoreModel[], ProductModel[]]) => this._mapQueryModel(categories, stores, products)
    )
  );

  constructor(private _categoryService: CategoryService, private _storeService: StoreService, private _productService: ProductService) {
  }

  private _mapQueryModel(categories: CategoryModel[], stores: StoreModel[], products: ProductModel[]): HomeQueryModel {

    const categoryProductsMap = products.reduce((a, c) => ({ ...a, [c.categoryId]: (a[c.categoryId] ?? []).concat(c) }), {} as Record<string, ProductModel[]>);

    return {
      categories: categories.map(category => ({
        id: category.id,
        imageUrl: category.imageUrl,
        name: category.name
      })),
      stores: stores.map(store => ({
        id: store.id,
        name: store.name,
        logoUrl: store.logoUrl,
        tags: (store.tags ?? []).map(tag => tag.name),
        distanceInKm: (store.distanceInMeters / 1000).toFixed(1)
      })),
      storesCount: stores.length ?? 0,
      featuredCategories: categories.filter(category => this.featuredCategoriesIds.includes(category.id))
        .sort((a, b) => this.featuredCategoriesIds.indexOf(a.id) - this.featuredCategoriesIds.indexOf(b.id))
        .map(category => ({
          id: category.id,
          name: category.name,
          products: (categoryProductsMap[category.id] ?? []).sort((a, b) => b.featureValue - a.featureValue)
            .slice(0, 5)
            .map(product => ({
              id: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl
            }))
        }))
    }
  }
}
