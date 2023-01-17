import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HomeQueryModel } from '../../query-models/home.query-model';
import { CategoryModel } from '../../models/category.model';
import { StoreModel } from '../../models/store.model';
import { CategoryService } from '../../services/category.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly model$: Observable<HomeQueryModel> = combineLatest([
    this._categoryService.getAll(),
    this._storeService.getAllWithTags()
  ]).pipe(
    map(
      ([categories, stores]: [CategoryModel[], StoreModel[]]) => this._mapQueryModel(categories, stores)
    )
  );

  constructor(private _categoryService: CategoryService, private _storeService: StoreService) {
  }

  private _mapQueryModel(categories: CategoryModel[], stores: StoreModel[]): HomeQueryModel {
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
      storesCount: stores.length ?? 0
    }
  }
}
