import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { HomeQueryModel } from '../../query-models/home.query-model';
import { CategoryModel } from '../../models/category.model';
import { StoreModel } from '../../models/store.model';
import { ProductModel } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';
import { CategoryId } from 'src/app/statics/category-id.static';
import { HomeCategoryQueryModel } from 'src/app/query-models/home-category.query-model';
import { HomeStoreQueryModel } from 'src/app/query-models/home-store.query-model';
import { HomeFeaturedCategoryQueryModel } from 'src/app/query-models/home-featured-category.query-model';
import { HomeFeaturedCategoryProductQueryModel } from 'src/app/query-models/home-featured-category-product.query-model';
import { HomeComponentConfig } from 'src/app/statics/home-component-config.static';
import { StoreTagModel } from 'src/app/models/store-tag.model';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  private _featuredCategoriesIds: Observable<string[]> = of([CategoryId.fruitsAndVegetables, CategoryId.snackAndMunchies]);

  readonly model$: Observable<HomeQueryModel> = combineLatest([
    this._categoryService.getAll(),
    this._storeService.getAll(),
    this._storeService.getAllTags(),
    this._productService.getAll(),
    this._featuredCategoriesIds
  ]).pipe(
    map(
      (
        [categories, stores, storeTags, products, featuredCategoriesIds]:
        [CategoryModel[], StoreModel[], StoreTagModel[], ProductModel[], string[]]
      ) => this._mapQueryModel(categories, stores, storeTags, products, featuredCategoriesIds)
    )
  );

  constructor(private _categoryService: CategoryService, private _storeService: StoreService, private _productService: ProductService) {
  }

  private _mapQueryModel(
    categories: CategoryModel[],
    stores: StoreModel[],
    storeTags: StoreTagModel[],
    products: ProductModel[],
    featuredCategoriesIds: string[]
  ): HomeQueryModel {
    return {
      categories: this._mapCategoriesToQueryModel(categories),
      stores: this._mapStoresToQueryModel(stores, storeTags),
      storesCount: stores.length ?? 0,
      featuredCategories: this._mapFeaturedCategoriesToQueryModel(categories, products, featuredCategoriesIds)
    }
  }

  private _mapCategoriesToQueryModel(categories: CategoryModel[]): HomeCategoryQueryModel[] {
    return categories.map(category => ({
      id: category.id,
      imageUrl: category.imageUrl,
      name: category.name
    }));
  }

  private _mapStoresToQueryModel(stores: StoreModel[], storeTags: StoreTagModel[]): HomeStoreQueryModel[] {
    const tagsMap = storeTags.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, StoreTagModel>);

    return stores.map(store => ({
      id: store.id,
      name: store.name,
      logoUrl: store.logoUrl,
      tags: (store.tagIds ?? []).map(tagId => tagsMap[tagId].name),
      distanceInMeters: store.distanceInMeters
    }));
  }

  private _mapFeaturedCategoriesToQueryModel(categories: CategoryModel[], products: ProductModel[], featuredCategoriesIds: string[]): HomeFeaturedCategoryQueryModel[] {
    const categoryProductsMap = products.reduce((a, c) => ({ ...a, [c.categoryId]: (a[c.categoryId] ?? []).concat(c) }), {} as Record<string, ProductModel[]>);

    return categories.filter(category => featuredCategoriesIds.includes(category.id))
      .sort((a, b) => featuredCategoriesIds.indexOf(a.id) - featuredCategoriesIds.indexOf(b.id))
      .map(category => ({
        id: category.id,
        name: category.name,
        products: this._mapFeaturedCategoriesProducts((categoryProductsMap[category.id] ?? []))
      }));
  }

  private _mapFeaturedCategoriesProducts(products: ProductModel[]): HomeFeaturedCategoryProductQueryModel[] {
    return products.sort((a, b) => b.featureValue - a.featureValue)
      .slice(0, HomeComponentConfig.maxFeaturedCategoryProducts)
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl
      }));
  }
}
