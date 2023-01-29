import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, shareReplay } from 'rxjs';
import { BasketProductModel } from '../models/basket-product.model';

@Injectable({ providedIn: 'root' })
export class BasketService {
  private _productsSubject: BehaviorSubject<BasketProductModel[]> = new BehaviorSubject<BasketProductModel[]>([]);
  private _products$: Observable<BasketProductModel[]> = this._productsSubject.asObservable().pipe(
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
}
