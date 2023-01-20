import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private _httpClient: HttpClient) {
  }

  getAll(): Observable<CategoryModel[]> {
    return this._httpClient.get<CategoryModel[]>('https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-categories');
  }

  getOne(id: string): Observable<CategoryModel> {
    return this._httpClient.get<CategoryModel>(`https://6384fca14ce192ac60696c4b.mockapi.io/freshcart-categories/${id}`);
  }
}
