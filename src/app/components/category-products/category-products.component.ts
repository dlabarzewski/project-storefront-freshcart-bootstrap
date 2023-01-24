import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, debounceTime, map, of, shareReplay, take, tap, startWith, mapTo, switchMap } from 'rxjs';
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
  readonly storesFilter: FormControl = new FormControl();

  private _storesList: Observable<StoreModel[]> = this._storeService.getAll().pipe(
    shareReplay(1)
  );

  private _queryParams = this._activatedRoute.queryParams.pipe(
    shareReplay(1)
  );

  readonly stores: FormGroup = new FormGroup({});

  private _defaultLimit: number = 5;

  private _sortings$: Observable<CategoryProductsSortQueryModel[]> = of([
    { id: ProductSorting.featureValueDesc, name: 'Featured', sortBy: 'featureValue', sortAsc: false },
    { id: ProductSorting.priceAsc, name: 'Price: Low to High', sortBy: 'price', sortAsc: true },
    { id: ProductSorting.priceDesc, name: 'Price: High to Low', sortBy: 'price', sortAsc: false },
    { id: ProductSorting.ratingValueDesc, name: 'Avg. Rating', sortBy: 'ratingValue', sortAsc: false }
  ]);

  private _ratingOptions$: Observable<number[]> = of([5, 4, 3, 2, 1]);
  private _ratingValues$: Observable<number[]> = of([1, 2, 3, 4, 5]);

  private _pageSizeOptions$: Observable<number[]> = of([5, 10, 15]);

  private _pagesSubject: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public pages$: Observable<number[]> = this._pagesSubject.asObservable();

  private _filters$: Observable<CategoryProductsFiltersQueryModel> = combineLatest([
    this._activatedRoute.params,
    this._queryParams,
    this._sortings$,
    this._pageSizeOptions$,
    this._ratingOptions$,
    this._ratingValues$,
    this.storesFilter.valueChanges.pipe(
      startWith('')
    )
  ]).pipe(
    map(
      (
        [params, queryParams, sortings, pageSizeOptions, ratingOptions, ratingValues, storesFilter]:
          [Params, Params, CategoryProductsSortQueryModel[], number[], number[], number[], string]
      ) => ({
        categoryId: params['categoryId'],
        sort: queryParams['sort'] !== undefined ? +queryParams['sort'] : ProductSorting.featureValueDesc,
        limit: queryParams['limit'] !== undefined && +queryParams['limit'] > 0 ? +queryParams['limit'] : this._defaultLimit,
        page: queryParams['page'] !== undefined && +queryParams['page'] > 0 ? +queryParams['page'] : 1,
        rate: queryParams['rate'] !== undefined && +queryParams['rate'] > 0 ? +queryParams['rate'] : 0,
        sortings,
        pageSizeOptions,
        priceFrom: queryParams['priceFrom'],
        priceTo: queryParams['priceTo'],
        ratingOptions,
        ratingValues,
        checkedStores: queryParams['stores'] !== undefined && queryParams['stores'] !== '' ? queryParams['stores'].split(',') : [],
        storesFilter
      })
    )
  );

  readonly model$: Observable<CategoryProductsQueryModel> = combineLatest([
    this._filters$,
    this._categoryService.getAll(),
    this._productService.getAll(),
    this._storesList
  ]).pipe(
    map(
      (
        [filters, categories, products, stores]: [CategoryProductsFiltersQueryModel, CategoryModel[], ProductModel[], StoreModel[]]
      ) => this._mapQueryModel(filters, categories, products, stores)
    )
  );

  constructor(private _categoryService: CategoryService, private _activatedRoute: ActivatedRoute, private _productService: ProductService, private _router: Router, private _storeService: StoreService) {
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

    combineLatest([
      this._storesList,
      this._queryParams
    ]).pipe(
      take(1),
      tap(
        ([stores, queryParams]: [StoreModel[], any]) => {

          const checkedStores: string[] = queryParams['stores'] !== undefined && queryParams['stores'] !== '' ? queryParams['stores'].split(',') : [];

          const checkedStoresMap = checkedStores.reduce((a, c) => ({ ...a, [c]: true }), {} as Record<string, boolean>);

          const controls = stores.reduce(
            (a, c) => ({ ...a, [c.id]: new FormControl(checkedStoresMap[c.id] ?? false) }),
            {} as { [key: string]: AbstractControl; }
          );

          Object.keys(controls).forEach(key => {
            this.stores.addControl(key, controls[key], { emitEvent: false });
          });
        }
      )
    ).subscribe();

    this.stores.valueChanges.pipe(
      tap(storesValue => {
        const checkedStores = Object.keys(storesValue)
          .filter(store => storesValue[store] === true);

        const storesList = Array.from(checkedStores).join(',');

        this._navigate({ stores: storesList === '' ? undefined : storesList })
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

  public onRatingChange(rate: number): void {
    this._navigate({ rate: rate });
  }

  public onRatingClick(value: number): void {
    this._queryParams.pipe(
      tap(params => {
        this._navigate({ rate: value == params['rate'] ? undefined : value });
      }),
      take(1)
    ).subscribe();
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
    const selectedSort = filters.sortings.find(sort => sort.id === filters.sort);

    return products.filter(
      product => product.categoryId === filters.categoryId
        && (isNaN(parseInt(filters.priceFrom)) || product.price >= parseInt(filters.priceFrom))
        && (isNaN(parseInt(filters.priceTo)) || product.price <= parseInt(filters.priceTo))
        && product.ratingValue >= filters.rate
        && (!filters.checkedStores.length || product.storeIds.find(storeId => filters.checkedStores.includes(storeId)))
    )
      .sort((a: ProductModel, b: ProductModel) => {
        if (selectedSort === undefined) return 0;

        if (selectedSort.sortAsc) return +a[selectedSort.sortBy] - +b[selectedSort.sortBy];

        return +b[selectedSort.sortBy] - +a[selectedSort.sortBy];
      });
  }

  private _mapQueryModel(
    filters: CategoryProductsFiltersQueryModel,
    categories: CategoryModel[],
    products: ProductModel[],
    stores: StoreModel[]
  ): CategoryProductsQueryModel {
    const currentProducts = this._filterProducts(filters, products);

    this._setPages(filters, currentProducts.length);

    const paginatedProducts = currentProducts.slice(
      (filters.page - 1) * filters.limit,
      filters.page * filters.limit
    );

    const categoriesMap = categories.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, CategoryModel>);

    return {
      category: categoriesMap[filters.categoryId] ? this._mapCategoryToQueryModel(categoriesMap[filters.categoryId]) : undefined,
      categories: categories.map(category => this._mapCategoryToQueryModel(category)),
      products: paginatedProducts.map(product => this._mapProductToQueryModel(product, categoriesMap[product.categoryId])),
      productsCount: currentProducts.length,
      filters: filters,
      stores: stores.filter(store => this._filterStoreVisibility(filters, store))
        .map(store => this._mapStoreToQueryModel(store))
    }
  }

  private _filterStoreVisibility(filters: CategoryProductsFiltersQueryModel, store: StoreModel): boolean {
    return !!(
      filters.storesFilter === ''
      || (
        store.name.toLowerCase().includes(filters.storesFilter.toLowerCase())
        || (filters.checkedStores.length && filters.checkedStores.includes(store.id))
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
