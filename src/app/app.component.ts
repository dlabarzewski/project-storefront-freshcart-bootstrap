import { Component } from '@angular/core';
import { combineLatest, map, Observable, of, shareReplay } from 'rxjs';
import { CategoryModel } from './models/category.model';
import { StoreModel } from './models/store.model';
import { LayoutQueryModel } from './query-models/layout.query-model';
import { CategoryService } from './services/category.service';
import { StoreService } from './services/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-freshcard-bootstrap-theme';

  readonly model$: Observable<LayoutQueryModel> = combineLatest([
    this._categoryService.getAll(),
    this._storeService.getAll(),
    of(['Company', 'About', 'Blog', 'Help Center', 'Our Value'])
  ]).pipe(
    map(
      ([categories, stores, footerLinks]: [CategoryModel[], StoreModel[], string[]]) => this._mapQueryModel(categories, stores, footerLinks)
    ),
    shareReplay(1)
  )

  constructor(private _categoryService: CategoryService, private _storeService: StoreService) {
  }

  private _mapQueryModel(categories: CategoryModel[], stores: StoreModel[], footerLinks: string[]): LayoutQueryModel {
    return {
      categories,
      stores,
      footerLinks
    };
  }
}
