import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { RatingComponentModule } from '../rating/rating.component-module';
import { CategoryProductsComponent } from './category-products.component';

@NgModule({
  imports: [CommonModule, RouterModule, RatingComponentModule, ReactiveFormsModule],
  declarations: [CategoryProductsComponent],
  providers: [],
  exports: [CategoryProductsComponent]
})
export class CategoryProductsComponentModule {
}
