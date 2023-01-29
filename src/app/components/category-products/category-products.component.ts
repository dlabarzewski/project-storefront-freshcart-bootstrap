import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, debounceTime, map, of, shareReplay, take, tap, startWith, mapTo, switchMap, filter } from 'rxjs';
import { CategoryProductsSortQueryModel } from '../../query-models/category-products-sort.query-model';
import { CategoryProductsFiltersQueryModel } from '../../query-models/category-products-filters.query-model';
import { CategoryProductsQueryModel } from '../../query-models/category-products.query-model';
import { CategoryModel } from '../../models/category.model';
import { ProductModel } from '../../models/product.model';
import { StoreModel } from '../../models/store.model';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { StoreService } from '../../services/store.service';
import { CategoryProductsCategoryQueryModel } from '../../query-models/category-products-category.query-model';
import { CategoryProductsProductQueryModel } from '../../query-models/category-products-product.query-model';
import { ProductSorting } from 'src/app/statics/product-sorting.static';
import { CategoryProductsStoreQueryModel } from 'src/app/query-models/category-products-store.query-model';
import { CategoryProductsConfig } from 'src/app/statics/category-products-config.static';
import { CategoryProductsAvailableFiltersQueryModel } from 'src/app/query-models/category-products-available-filters.query-model';

@Component({
  selector: 'app-category-products',
  styleUrls: ['./category-products.component.scss'],
  templateUrl: './category-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryProductsComponent implements OnInit {

  readonly priceFromFilter: FormControl = new FormControl(this._activatedRoute.snapshot.queryParams['priceFrom']);
  readonly priceToFilter: FormControl = new FormControl(this._activatedRoute.snapshot.queryParams['priceTo']);
  readonly storeSearchFilter: FormControl = new FormControl();
  readonly storesFilter: FormGroup = new FormGroup({});

  private _storesList$: Observable<StoreModel[]> = this._storeService.getAll().pipe( shareReplay(1) );

  private _categoriesList$: Observable<CategoryModel[]> = this._categoryService.getAll().pipe( shareReplay(1) );

  private _routeParams: Observable<Params> = this._activatedRoute.params.pipe( shareReplay(1) );

  private _queryParams: Observable<Params> = this._activatedRoute.queryParams.pipe( shareReplay(1) );

  private _products$: Observable<ProductModel[]> = this._productService.getAll().pipe( shareReplay(1) );

  private _sortings$: Observable<CategoryProductsSortQueryModel[]> = of(CategoryProductsConfig.sortings).pipe( shareReplay(1) );

  private _checkedStores$: Observable<string[]> = this._queryParams.pipe(
    map(
      queryParams => this._parseStoresQueryParam(queryParams['stores'])
    )
  )

  private _filters$: Observable<CategoryProductsFiltersQueryModel> = combineLatest([
    this._routeParams,
    this._queryParams
  ]).pipe(
    map(
      (
        [params, queryParams]:
        [Params, Params]
      ) => ({
        categoryId: params['categoryId'],
        sort: this._parseNumericQueryParam(queryParams['sort'], ProductSorting.featureValueDesc),
        limit: this._parseNumericQueryParam(queryParams['limit'], CategoryProductsConfig.defaultLimit, true),
        page: this._parseNumericQueryParam(queryParams['page'], 1, true),
        rateFilter: this._parseNumericQueryParam(queryParams['rate'], 0, true),
        priceFromFilter: queryParams['priceFrom'] ?? '',
        priceToFilter: queryParams['priceTo'] ?? '',
        checkedStores: this._parseStoresQueryParam(queryParams['stores'])
      })
    ),
    shareReplay(1)
  );

  private _filteredProducts: Observable<ProductModel[]> = combineLatest([
    this._products$,
    this._filters$,
    this._sortings$
  ]).pipe(
    map(
      (
        [products, filters, sortings]:
        [ProductModel[], CategoryProductsFiltersQueryModel, CategoryProductsSortQueryModel[]]
      ) => this._filterProducts(filters, products, sortings)
    ),
    shareReplay(1)
  )

  private _pageSizeOptions$: Observable<number[]> = combineLatest([
    this._filters$,
    this._filteredProducts
  ]).pipe(
    tap(
      (
        [filters, products]: [CategoryProductsFiltersQueryModel, ProductModel[]]
      ) => {
        const maxPage = Math.ceil(products.length / filters.limit);

        if (filters.page > maxPage && maxPage !== 0) {
          this._navigate({ page: maxPage })
        }
      }
    ),
    map(
      (
        [filters, products]: [CategoryProductsFiltersQueryModel, ProductModel[]]
      ) => {
        const maxPage = Math.ceil(products.length / filters.limit);
    
        return Array.from(Array(maxPage).keys()).map(x => ++x);
      }
    )
  )

  private _availableFilters$: Observable<CategoryProductsAvailableFiltersQueryModel> = combineLatest([
    this._sortings$,
    of(CategoryProductsConfig.pageSizeOptions),
    of(CategoryProductsConfig.ratingOptions),
    this._storesList$,
    this._pageSizeOptions$,
    this._checkedStores$,
    this.storeSearchFilter.valueChanges.pipe( startWith('') )
  ]).pipe(
    map(
      (
        [sortings, pageSizeOptions, ratingOptions, stores, pages, checkedStores, storeSearchFilter]:
        [CategoryProductsSortQueryModel[], number[], number[], StoreModel[], number[], string[], string]
      ) => ({
        sortings,
        pageSizeOptions,
        ratingOptions,
        pages,
        stores: stores.filter(store => this._filterStoreVisibility(checkedStores, storeSearchFilter, store))
          .map(store => this._mapStoreToQueryModel(store))
      })
    ),
    shareReplay(1)
  );

  private _productsCount$: Observable<number> = this._filteredProducts.pipe(
    map((products: ProductModel[]) => products.length)
  );

  private _paginatedProducts$: Observable<CategoryProductsProductQueryModel[]> = combineLatest([
    this._filters$,
    this._categoriesList$,
    this._filteredProducts
  ]).pipe(
    map(
      (
        [filters, categories, products]:
        [CategoryProductsFiltersQueryModel, CategoryModel[], ProductModel[]]
      ) => {
        const paginatedProducts = products.slice(
          (filters.page - 1) * filters.limit,
          filters.page * filters.limit
        );

        const categoriesMap = categories.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, CategoryModel>);

        return paginatedProducts.map(product => this._mapProductToQueryModel(product, categoriesMap[product.categoryId]))
      }
    )
  )

  readonly model$: Observable<CategoryProductsQueryModel> = combineLatest([
    this._filters$,
    this._categoriesList$,
    this._paginatedProducts$,
    this._productsCount$,
    this._availableFilters$
  ]).pipe(
    map(
      (
        [filters, categories, products, productsCount, availableFilters]:
        [CategoryProductsFiltersQueryModel, CategoryModel[], CategoryProductsProductQueryModel[], number, CategoryProductsAvailableFiltersQueryModel]
      ) => {
        const categoriesMap = categories.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, CategoryModel>);

        return {
          category: categoriesMap[filters.categoryId] ? this._mapCategoryToQueryModel(categoriesMap[filters.categoryId]) : undefined,
          categories: categories.map(category => this._mapCategoryToQueryModel(category)),
          products,
          productsCount,
          filters,
          availableFilters
        }
      }
    ),
    tap(console.log)
  );

  constructor(private _categoryService: CategoryService, private _activatedRoute: ActivatedRoute, private _productService: ProductService, private _router: Router, private _storeService: StoreService) {
  }

  ngOnInit(): void {
    this.priceFromFilter.valueChanges.pipe(
      debounceTime(250),
      tap((value: string) => {
        this._navigate({ priceFrom: value })
      })
    ).subscribe();

    this.priceToFilter.valueChanges.pipe(
      debounceTime(250),
      tap((value: string) => {
        this._navigate({ priceTo: value })
      })
    ).subscribe();

    combineLatest([
      this._storesList$,
      this._queryParams
    ]).pipe(
      take(1),
      tap(
        ([stores, queryParams]: [StoreModel[], Params]) => {

          const checkedStores: string[] = this._parseStoresQueryParam(queryParams['stores']);

          const checkedStoresMap = checkedStores.reduce((a, c) => ({ ...a, [c]: true }), {} as Record<string, boolean>);

          const controls = stores.reduce(
            (a, c) => ({ ...a, [c.id]: new FormControl(checkedStoresMap[c.id] ?? false) }),
            {} as { [key: string]: AbstractControl; }
          );

          Object.keys(controls).forEach(key => {
            this.storesFilter.addControl(key, controls[key], { emitEvent: false });
          });
        }
      )
    ).subscribe();

    this.storesFilter.valueChanges.pipe(
      tap((storesValue: { [key: string]: boolean }) => {
        const checkedStores = Object.keys(storesValue)
          .filter(store => storesValue[store] === true);

        const storesList = Array.from(checkedStores).join(',');

        this._navigate({ stores: storesList === '' ? undefined : storesList })
      })
    ).subscribe();

    // this._queryParams.pipe(
    //   tap(
    //     (queryParams: Params) => {
    //       const checkedStores: string[] = this._parseStoresQueryParam(queryParams['stores']);

    //       const checkedStoresMap = checkedStores.reduce((a, c) => ({ ...a, [c]: true }), {} as Record<string, boolean>);

    //       Object.keys(this.storesFilter.controls).forEach(
    //         storeKey => {
    //           this.storesFilter.controls[storeKey].setValue(checkedStoresMap[storeKey] ?? false)
    //         }
    //       );
    //     }
    //   )
    // ).subscribe();
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

  public onRatingClick(value: number): void {
    this._queryParams.pipe(
      tap((params: Params) => {
        this._navigate({ rate: value == params['rate'] ? undefined : value });
      }),
      take(1)
    ).subscribe();
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

  private _parseNumericQueryParam(param: string|undefined, defaultValue: number = 0, isPositive: boolean = false): number {
    return param !== undefined && (!isPositive || +param > 0) ? +param : defaultValue
  }

  private _parseStoresQueryParam(stores: string|undefined): string[] {
    return stores !== undefined && stores !== '' ? stores.split(',') : [];
  }

  private _filterProducts(filters: CategoryProductsFiltersQueryModel, products: ProductModel[], sortings: CategoryProductsSortQueryModel[]): ProductModel[] {
    const selectedSort: CategoryProductsSortQueryModel|undefined = sortings.find(sort => sort.id === filters.sort);

    const filteredProducts = products.filter(
      (product: ProductModel) => product.categoryId === filters.categoryId
        && (isNaN(parseInt(filters.priceFromFilter)) || product.price >= parseInt(filters.priceFromFilter))
        && (isNaN(parseInt(filters.priceToFilter)) || product.price <= parseInt(filters.priceToFilter))
        && product.ratingValue >= filters.rateFilter
        && (!filters.checkedStores.length || product.storeIds.find(storeId => filters.checkedStores.includes(storeId)))
    );

    if (selectedSort === undefined) return filteredProducts;

    return filteredProducts.sort((a: ProductModel, b: ProductModel) => {
      return (selectedSort.sortAsc)
        ? +a[selectedSort.sortBy] - +b[selectedSort.sortBy]
        : +b[selectedSort.sortBy] - +a[selectedSort.sortBy];
    });
  }

  private _filterStoreVisibility(checkedStores: string[], storeSearchFilter: string, store: StoreModel): boolean {
    return !!(
      storeSearchFilter === ''
      || (
        store.name.toLowerCase().includes(storeSearchFilter.toLowerCase())
        || (checkedStores.length && checkedStores.includes(store.id))
      )
    );
  }

  private _mapStoreToQueryModel(store: StoreModel): CategoryProductsStoreQueryModel {
    return {
      id: store.id,
      name: store.name
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
