import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryProductsComponent } from './category-products.component';
import { RatingComponentModule } from '../rating/rating.component-module';

@NgModule({
  imports: [CommonModule, RouterModule, RatingComponentModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent]
})
export class CategoryProductsComponentModule {
}
