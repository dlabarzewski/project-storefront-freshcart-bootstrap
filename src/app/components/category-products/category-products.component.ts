import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, of, map, startWith, tap, debounce, debounceTime } from 'rxjs';
import { CategoryProductsSortQueryModel } from '../../query-models/category-products-sort.query-model';
import { CategoryProductsFiltersQueryModel } from '../../query-models/category-products-filters.query-model';
import { CategoryProductsQueryModel } from '../../query-models/category-products.query-model';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { CategoryProductsCategoryQueryModel } from '../../query-models/category-products-category.query-model';
import { CategoryProductsProductQueryModel } from '../../query-models/category-products-product.query-model';
import { ProductSorting } from 'src/app/statics/product-sorting.static';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent implements OnInit {

  readonly priceFrom: FormControl = new FormControl(this._activatedRoute.snapshot.queryParams['priceFrom']);
  readonly priceTo: FormControl = new FormControl(this._activatedRoute.snapshot.queryParams['priceTo']);

  private _defaultLimit: number = 5;

  private _sortings$: Observable<CategoryProductsSortQueryModel[]> = of([
    { id: ProductSorting.featureValueDesc, name: 'Featured' },
    { id: ProductSorting.priceAsc, name: 'Price: Low to High' },
    { id: ProductSorting.priceDesc, name: 'Price: High to Low' },
    { id: ProductSorting.ratingValueDesc, name: 'Avg. Rating' }
  ]);

  private _pageSizeOptions$: Observable<number[]> = of([5, 10, 15]);

  private _pagesSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public pages$: Observable<number[]> = this._pagesSubject.asObservable();

  private _filters$: Observable<CategoryProductsFiltersQueryModel> = combineLatest([
    this._activatedRoute.params,
    this._activatedRoute.queryParams,
    this._sortings$,
    this._pageSizeOptions$
  ]).pipe(
    map(
      (
        [params, queryParams, sortings, pageSizeOptions]:
        [Params, Params, CategoryProductsSortQueryModel[], number[]]
      ) => ({
        categoryId: params['categoryId'],
        sort: queryParams['sort'] !== undefined ? +queryParams['sort'] : ProductSorting.featureValueDesc,
        limit: queryParams['limit'] !== undefined && +queryParams['limit'] > 0 ? +queryParams['limit'] : this._defaultLimit,
        page: queryParams['page'] !== undefined && +queryParams['page'] > 0 ? +queryParams['page'] : 1,
        sortings,
        pageSizeOptions,
        priceFrom: queryParams['priceFrom'],
        priceTo: queryParams['priceTo']
      }))
  );

  readonly model$: Observable<CategoryProductsQueryModel> = combineLatest([
    this._filters$,
    this._categoryService.getAll(),
    this._productService.getAll()
  ]).pipe(
    map(
      (
        [filters, categories, products]: [CategoryProductsFiltersQueryModel, CategoryModel[], ProductModel[]]
      ) => this._mapQueryModel(filters, categories, products)
    )
  );

  constructor(private _categoryService: CategoryService, private _activatedRoute: ActivatedRoute, private _productService: ProductService, private _router: Router) {
  }

  ngOnInit(): void {
    this.priceFrom.valueChanges.pipe(
      debounceTime(250),
      tap(value => {
        this._navigate({ priceFrom: value })
      })
    ).subscribe();

    this.priceTo.valueChanges.pipe(
      debounceTime(250),
      tap(value => {
        this._navigate({ priceTo: value })
      })
    ).subscribe();
  }

  public onSortingChange(target: EventTarget | null): void {
    if (target === null) return;

    const value = (target as HTMLSelectElement).value;

    this._navigate({ sort: value });
  }

  public onLimitChange(limit: number): void {
    this._navigate({ limit: limit });
  }

  public onPageChange(page: number): void {
    this._navigate({ page: page });
  }

  private _setPages(filters: CategoryProductsFiltersQueryModel, productsCount: number): void {
    const maxPage = Math.ceil(productsCount / filters.limit);

    const pages = Array.from(Array(maxPage).keys()).map(x => ++x);

    this._pagesSubject.next(pages);

    if (filters.page > maxPage && maxPage !== 0) {
      this._navigate({ page: maxPage })
    }
  }

  private _navigate(queryParams: Object) {
    this._router.navigate(
      [],
      {
        relativeTo: this._activatedRoute,
        queryParams: queryParams,
        queryParamsHandling: 'merge'
      }
    )
  }

  private _filterProducts(filters: CategoryProductsFiltersQueryModel, products: ProductModel[]): ProductModel[] {
    products = products.filter(product => product.categoryId === filters.categoryId);

    if (!isNaN(parseInt(filters.priceFrom))) {
      const priceFrom = parseInt(filters.priceFrom);
      products = products.filter(product => product.price >= priceFrom);
    }

    if (!isNaN(parseInt(filters.priceTo))) {
      const priceTo = parseInt(filters.priceTo);
      products = products.filter(product => product.price <= priceTo);
    }

    return products;
  }

  private _sortProducts(filters: CategoryProductsFiltersQueryModel, products: ProductModel[]): ProductModel[] {
    const sortFunctionsMap = new Map([
      [ProductSorting.featureValueDesc, (a: ProductModel, b: ProductModel) => b.featureValue - a.featureValue],
      [ProductSorting.priceAsc, (a: ProductModel, b: ProductModel) => a.price - b.price],
      [ProductSorting.priceDesc, (a: ProductModel, b: ProductModel) => b.price - a.price],
      [ProductSorting.ratingValueDesc, (a: ProductModel, b: ProductModel) => b.ratingValue - a.ratingValue],
    ]);

    const sortFunction = sortFunctionsMap.get(filters.sort) ?? sortFunctionsMap.get(ProductSorting.featureValueDesc);

    const sortedProducts = products.sort(sortFunction);

    return sortedProducts;
  }

  private _paginateProducts(filters: CategoryProductsFiltersQueryModel, products: ProductModel[]): ProductModel[] {
    return products.slice(
      (filters.page - 1) * filters.limit,
      filters.page * filters.limit
    );
  }

  private _mapQueryModel(
    filters: CategoryProductsFiltersQueryModel,
    categories: CategoryModel[],
    products: ProductModel[]
  ): CategoryProductsQueryModel {
    products = this._filterProducts(filters, products);

    products = this._sortProducts(filters, products);

    const productsCount = products.length;

    this._setPages(filters, productsCount);

    products = this._paginateProducts(filters, products);

    const categoriesMap = categories.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, CategoryModel>);

    return {
      category: categoriesMap[filters.categoryId] ? this._mapCategoryToQueryModel(categoriesMap[filters.categoryId]) : undefined,
      categories: categories.map(category => this._mapCategoryToQueryModel(category)),
      products: products.map(product => this._mapProductToQueryModel(product, categoriesMap[product.categoryId])),
      productsCount: productsCount,
      filters: filters
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
