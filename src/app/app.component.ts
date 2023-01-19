import { Component } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of, shareReplay } from 'rxjs';
import { LayoutQueryModel } from './query-models/layout.query-model';
import { CategoryModel } from './models/category.model';
import { StoreModel } from './models/store.model';
import { CategoryService } from './services/category.service';
import { StoreService } from './services/store.service';

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
    this._isMobileMenuShownSubject.asObservable()
  ]).pipe(
    map(
      (
        [categories, stores, footerLinks, isMobileMenuShown]: [CategoryModel[], StoreModel[], string[], boolean]
      ) => this._mapQueryModel(categories, stores, footerLinks, isMobileMenuShown)
    ),
    shareReplay(1)
  )
  public isMobileMenuShown$: Observable<boolean> = this._isMobileMenuShownSubject.asObservable();

  constructor(private _categoryService: CategoryService, private _storeService: StoreService) {
  }

  private _mapQueryModel(categories: CategoryModel[], stores: StoreModel[], footerLinks: string[], isMobileMenuShown: boolean): LayoutQueryModel {
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
      isMobileMenuShown
    };
  }

  public toggleMobileMenu(): void {
    this._isMobileMenuShownSubject.next(!this._isMobileMenuShownSubject.value);
  }

  public hideMobileMenu(): void {
    this._isMobileMenuShownSubject.next(false);
  }
}
