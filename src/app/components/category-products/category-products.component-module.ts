import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingComponentModule } from '../rating/rating.component-module';
import { CategoryProductsComponent } from './category-products.component';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [RatingComponentModule, ReactiveFormsModule, SharedModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent]
})
export class CategoryProductsComponentModule {
}
