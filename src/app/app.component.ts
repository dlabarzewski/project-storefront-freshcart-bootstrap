import { Component } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of, shareReplay } from 'rxjs';
import { LayoutQueryModel } from './query-models/layout.query-model';
import { CategoryModel } from './models/category.model';
import { StoreModel } from './models/store.model';
import { CategoryService } from './services/category.service';
import { StoreService } from './services/store.service';
import { BasketService } from './services/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-freshcard-bootstrap-theme';

  private _isMobileMenuShownSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  readonly model$: Observable<LayoutQueryModel> = combineLatest([
    this._categoryService.getAll(),
    this._storeService.getAll(),
    of(['Company', 'About', 'Blog', 'Help Center', 'Our Value']),
    this._isMobileMenuShownSubject.asObservable(),
    this._basketService.getCount()
  ]).pipe(
    map(
      (
        [categories, stores, footerLinks, isMobileMenuShown, basketProductsCount]:
        [CategoryModel[], StoreModel[], string[], boolean, number]
      ) => this._mapQueryModel(categories, stores, footerLinks, isMobileMenuShown, basketProductsCount)
    ),
    shareReplay(1)
  )

  constructor(private _categoryService: CategoryService, private _storeService: StoreService, private _basketService: BasketService) {
  }

  private _mapQueryModel(
    categories: CategoryModel[],
    stores: StoreModel[],
    footerLinks: string[],
    isMobileMenuShown: boolean,
    basketProductsCount: number
  ): LayoutQueryModel {
    return {
      categories: categories.map(category => ({
        id: category.id,
        name: category.name
      })),
      stores: stores.map(store => ({
        id: store.id,
        name: store.name
      })),
      footerLinks,
      isMobileMenuShown,
      basketProductsCount
    };
  }

  public toggleMobileMenu(): void {
    this._isMobileMenuShownSubject.next(!this._isMobileMenuShownSubject.value);
  }

  public hideMobileMenu(): void {
    this._isMobileMenuShownSubject.next(false);
  }
}
