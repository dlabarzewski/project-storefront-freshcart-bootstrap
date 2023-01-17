import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { HomeQueryModel } from 'src/app/query-models/home.query-model';
import { CategoryModel } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  readonly model$: Observable<HomeQueryModel> = combineLatest([
    this._categoryService.getAll()
  ]).pipe(
    map(
      ([categories]: [CategoryModel[]]) => this._mapQueryModel(categories)
    )
  );

  constructor(private _categoryService: CategoryService) {
  }

  private _mapQueryModel(categories: CategoryModel[]): HomeQueryModel {
    return {
      categories
    }
  }
}
