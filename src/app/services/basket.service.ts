import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay, tap } from 'rxjs';
import { BasketProductModel } from '../models/basket-product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private _storageKey: string = 'basket';

  private _productsSubject: BehaviorSubject<BasketProductModel[]> = new BehaviorSubject<BasketProductModel[]>(this._getProductsFromStorage());
  private _products$: Observable<BasketProductModel[]> = this._productsSubject.asObservable().pipe(
    tap(
      products => this._setProductsInStorage(products)
    ),
    shareReplay(1)
  )

  getCount(): Observable<number> {
    return this._products$.pipe(
      map(products => products.length)
    )
  }

  getProducts(): Observable<BasketProductModel[]> {
    return this._products$;
  }

  addProduct(id: string): void {
    const products = this._productsSubject.value;

    const product = products.find(product => product.id === id);

    if (!product) {
      this._productsSubject.next([...products, { id: id, quantity: 1 }]);

      return;
    }

    const newProducts = products.map(product => {
      if (product.id !== id) return product;

      return {
        id,
        quantity: product.quantity + 1
      }
    });

    this._productsSubject.next(newProducts);
  }

  changeProductQuantity(id: string, quantity: number): void {
    const newProducts = this._productsSubject.value.map(product => {
      if (product.id !== id) return product;

      return {
        id,
        quantity: quantity
      }
    });

    this._productsSubject.next(newProducts);
  }

  removeProduct(id: string): void {
    const newProducts = this._productsSubject.value.filter(product => product.id !== id);

    this._productsSubject.next(newProducts);
  }

  private _getProductsFromStorage(): BasketProductModel[] {
    const storageProducts = window.sessionStorage.getItem(this._storageKey);

    if (storageProducts === null) return [];

    try {
      return JSON.parse(storageProducts);
    }
    catch(e) {
      return [];
    }
  }

  private _setProductsInStorage(products: BasketProductModel[]): void {
    const storageProducts = JSON.stringify(products);

    window.sessionStorage.setItem(this._storageKey, storageProducts);
  }
}
