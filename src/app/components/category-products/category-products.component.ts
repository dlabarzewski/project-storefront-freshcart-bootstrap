import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, combineLatest, of, map } from 'rxjs';
import { CategoryProductsQueryModel } from '../../query-models/category-products.query-model';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoryProductsSortQueryModel } from '../../query-models/category-products-sort.query-model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { CategoryProductsCategoryQueryModel } from '../../query-models/category-products-category.query-model';
import { CategoryProductsProductQueryModel } from '../../query-models/category-products-product.query-model';
import { ProductSorting } from 'src/app/statics/product-sorting.static';

import { CategoryProductsFiltersModel } from 'src/app/models/category-products-filters.model';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent {

  private _filters$: Observable<CategoryProductsFiltersModel> = combineLatest([
    this._activatedRoute.params,
    this._activatedRoute.queryParams
  ]).pipe(
    map(
      ([params, queryParams]: [Params, Params]) => ({
        categoryId: params['categoryId'],
        sort: queryParams['sort'] !== undefined ? +queryParams['sort'] : ProductSorting.featureValueDesc
    }))
  );

  private _sortings$: Observable<CategoryProductsSortQueryModel[]> = of([
    { id: ProductSorting.featureValueDesc, name: 'Featured' },
    { id: ProductSorting.priceAsc, name: 'Price: Low to High' },
    { id: ProductSorting.priceDesc, name: 'Price: High to Low' },
    { id: ProductSorting.ratingValueDesc, name: 'Avg. Rating' }
  ]);

  readonly model$: Observable<CategoryProductsQueryModel> = combineLatest([
    this._filters$,
    this._categoryService.getAll(),
    this._productService.getAll(),
    this._sortings$
  ]).pipe(
    map(
      (
        [filters, categories, products, sortings]: [CategoryProductsFiltersModel, CategoryModel[], ProductModel[], CategoryProductsSortQueryModel[]]
      ) => this._mapQueryModel(filters, categories, products, sortings)
    )
  );

  constructor(private _categoryService: CategoryService, private _activatedRoute: ActivatedRoute, private _productService: ProductService, private _router: Router) {
  }

  public onSortingChange(target: EventTarget | null): void {
    if (target === null) return;

    const value = (target as HTMLSelectElement).value;

    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: {
          sort: value
        },
        queryParamsHandling: 'merge'
      }
    )
  }

  private _filterProducts(filters: CategoryProductsFiltersModel, products: ProductModel[]): ProductModel[] {
    const sortFunctionsMap = new Map([
      [ProductSorting.featureValueDesc, (a: ProductModel, b: ProductModel) => { return b.featureValue - a.featureValue }],
      [ProductSorting.priceAsc, (a: ProductModel, b: ProductModel) => { return a.price - b.price }],
      [ProductSorting.priceDesc, (a: ProductModel, b: ProductModel) => { return b.price - a.price }],
      [ProductSorting.ratingValueDesc, (a: ProductModel, b: ProductModel) => { return b.ratingValue - a.ratingValue }],
    ])

    const sortFunction = sortFunctionsMap.get(filters.sort) ?? sortFunctionsMap.get(ProductSorting.featureValueDesc);
    
    const categoryProducts = products.filter(product => product.categoryId === filters.categoryId);

    const sortedProducts = categoryProducts.sort(sortFunction);

    return sortedProducts;
  }

  private _mapQueryModel(
    filters: CategoryProductsFiltersModel,
    categories: CategoryModel[],
    products: ProductModel[],
    sortings: CategoryProductsSortQueryModel[]
  ): CategoryProductsQueryModel {
    const filteredProducts = this._filterProducts(filters, products);

    const categoriesMap = categories.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, CategoryModel>);

    return {
      category: categoriesMap[filters.categoryId] ? this._mapCategoryToQueryModel(categoriesMap[filters.categoryId]) : undefined,
      categories: categories.map(category => this._mapCategoryToQueryModel(category)),
      products: filteredProducts.map(product => this._mapProductToQueryModel(product, categoriesMap[product.categoryId])),
      productsCount: filteredProducts.length,
      sortings,
      filters
    }
  }

  private _mapCategoryToQueryModel(category: CategoryModel): CategoryProductsCategoryQueryModel {
    return {
      id: category.id,
      name: category.name
    };
  }

  private _mapProductToQueryModel(product: ProductModel, category: CategoryModel): CategoryProductsProductQueryModel {
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
