import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { BasketProductModel } from '../../models/basket-product.model';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';
import { BasketQueryModel } from 'src/app/query-models/basket.query-model';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BasketComponent {
  private _allProducts$: Observable<ProductModel[]> = this._productService.getAll();
  private _basketProducts$: Observable<BasketProductModel[]> = this._basketService.getProducts();

  private _freeDeliveryFrom: number = 50;
  private _defaultDeliveryValue: number = 10;

  readonly model$: Observable<BasketQueryModel> = combineLatest([
    this._allProducts$,
    this._basketProducts$
  ]).pipe(
    map(
      (
        [allProducts, basketProducts]: [ProductModel[], BasketProductModel[]]
      ) => this._mapQueryModel(allProducts, basketProducts)
    )
  )

  constructor(private _productService: ProductService, private _basketService: BasketService) {
  }

  private _mapQueryModel(allProducts: ProductModel[], basketProducts: BasketProductModel[]): BasketQueryModel {
    const productsMap = allProducts.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, ProductModel>);

    const availableProducts = basketProducts.filter(product => productsMap[product.id] !== undefined);

    const mappedProducts = availableProducts.map(availableProduct => {
      const product = productsMap[availableProduct.id];

      return {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: availableProduct.quantity,
        subtotal: product.price * availableProduct.quantity
      }
    });

    const productsSubtotal = mappedProducts.reduce((a, c) => a += c.subtotal, 0);

    const deliveryValue = productsSubtotal > this._freeDeliveryFrom ? 0 : this._defaultDeliveryValue;

    return {
      products: mappedProducts,
      subtotal: productsSubtotal + deliveryValue,
      productsSubtotal,
      deliveryValue,
      leftToFreeDelivery: deliveryValue ? this._freeDeliveryFrom - productsSubtotal : 0
    }
  }
}
