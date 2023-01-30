import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { BasketProductModel } from '../../models/basket-product.model';
import { ProductService } from '../../services/product.service';
import { BasketService } from '../../services/basket.service';
import { BasketQueryModel } from 'src/app/query-models/basket.query-model';
import { BasketProductQueryModel } from 'src/app/query-models/basket-product.query-model';

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

  public removeProduct(id: string): void {
    this._basketService.removeProduct(id);
  }

  public onChangeProductQuantity(id: string, event: Event): void {
    if (event.target === null) return;

    const quantity = parseInt((event.target as HTMLInputElement).value);

    if (isNaN(quantity)) return;

    this._basketService.changeProductQuantity(id, quantity);
  }

  public decrementProductQuantity(product: BasketProductQueryModel): void {
    if (product.quantity < 2) return;

    this._basketService.changeProductQuantity(product.id, product.quantity - 1);
  }

  public incrementProductQuantity(product: BasketProductQueryModel): void {
    this._basketService.changeProductQuantity(product.id, product.quantity + 1);
  }

  private _mapQueryModel(allProducts: ProductModel[], basketProducts: BasketProductModel[]): BasketQueryModel {
    const mappedProducts = this._mapProductsToQueryModel(allProducts, basketProducts);

    const productsSubtotal = mappedProducts.reduce((a, c) => a += c.subtotal, 0);

    const deliveryValue = productsSubtotal < this._freeDeliveryFrom ? this._defaultDeliveryValue : 0;

    return {
      products: mappedProducts,
      subtotal: productsSubtotal + deliveryValue,
      productsSubtotal,
      deliveryValue,
      leftToFreeDelivery: deliveryValue ? this._freeDeliveryFrom - productsSubtotal : 0
    }
  }

  private _mapProductsToQueryModel(allProducts: ProductModel[], basketProducts: BasketProductModel[]): BasketProductQueryModel[] {
    const productsMap = allProducts.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, ProductModel>);

    const availableProducts = basketProducts.filter(product => productsMap[product.id] !== undefined);

    return availableProducts.map(availableProduct => {
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
  }
}
