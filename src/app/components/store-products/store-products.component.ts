import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { StoreProductsQueryModel } from '../../query-models/store-products.query-model';
import { StoreModel } from '../../models/store.model';
import { ProductModel } from '../../models/product.model';
import { StoreService } from '../../services/store.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-store-products',
  styleUrls: ['./store-products.component.scss'],
  templateUrl: './store-products.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoreProductsComponent {
  readonly model$: Observable<StoreProductsQueryModel> = this._activatedRoute.params.pipe(
    switchMap(
      (params: Params) => combineLatest([
        this._storeService.getOne(params['storeId']),
        this._productService.getAll()
      ]).pipe(
        map(
          ([store, products]: [StoreModel, ProductModel[]]) => this._mapQueryModel(store, products)
        )
      )
    )
  )

  constructor(private _activatedRoute: ActivatedRoute, private _storeService: StoreService, private _productService: ProductService) {
  }

  private _mapQueryModel(store: StoreModel, products: ProductModel[]): StoreProductsQueryModel {
    return {
      id: store.id,
      name: store.name,
      distanceInMeters: store.distanceInMeters,
      logoUrl: store.logoUrl,
      products: products.filter(product => product.storeIds.includes(store.id))
        .map(product => ({
          id: product.id,
          name: product.name,
          imageUrl: product.imageUrl
        }))
    }
  }
}
