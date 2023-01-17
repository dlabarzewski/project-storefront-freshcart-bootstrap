import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { combineLatest, map, Observable } from 'rxjs';
import { StoreModel } from '../models/store.model';
import { StoreTagModel } from '../models/store-tag.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  constructor(private _httpClient: HttpClient) {
  }

  getAll(): Observable<StoreModel[]> {
    return this._httpClient.get<StoreModel[]>('https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-stores');
  }

  getAllWithTags(): Observable<StoreModel[]> {
    return combineLatest([
      this._httpClient.get<StoreModel[]>('https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-stores'),
      this._httpClient.get<StoreTagModel[]>('https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-store-tags')
    ]).pipe(
      map(
        ([stores, tags]: [StoreModel[], StoreTagModel[]]) => {
          const tagsMap = tags.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, StoreTagModel>);

          return stores.map(
            store => ({
              ...store,
              tags: store.tagIds.map(
                tagId => tagsMap[tagId]
              )
            })
          )
        }
      )
    )
  }

  getOne(id: string): Observable<StoreModel> {
    return this._httpClient.get<StoreModel>(`https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-stores/${id}`);
  }
}
