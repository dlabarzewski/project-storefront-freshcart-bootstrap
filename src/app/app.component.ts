import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryModel } from './models/category.model';
import { CategoryService } from './services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-freshcard-bootstrap-theme';
  readonly categories$: Observable<CategoryModel[]> = this._categoryService.getAll();

  constructor(private _categoryService: CategoryService) {
  }
}
