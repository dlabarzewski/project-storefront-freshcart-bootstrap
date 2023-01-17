import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
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
  readonly categories$: Observable<CategoryModel[]> = this._categoryService.getAll();
  readonly stores$: Observable<StoreModel[]> = this._storeService.getAll();
  readonly footerLinks$: Observable<string[]> = of(['Company', 'About', 'Blog', 'Help Center', 'Our Value']);

  constructor(private _categoryService: CategoryService, private _storeService: StoreService) {
  }
}
