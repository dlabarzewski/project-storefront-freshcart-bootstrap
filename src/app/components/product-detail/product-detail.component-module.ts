import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RatingComponentModule } from '../rating/rating.component-module';
import { ProductDetailComponent } from './product-detail.component';

@NgModule({
  imports: [CommonModule, RouterModule, RatingComponentModule, TabsModule, CarouselModule],
  declarations: [ProductDetailComponent],
  providers: [],
  exports: [ProductDetailComponent]
})
export class ProductDetailComponentModule {
}
