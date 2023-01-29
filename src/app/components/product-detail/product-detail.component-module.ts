import { NgModule } from '@angular/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared.module';
import { RatingComponentModule } from '../rating/rating.component-module';
import { ProductDetailComponent } from './product-detail.component';

@NgModule({
  imports: [RatingComponentModule, TabsModule, CarouselModule, AlertModule, SharedModule],
  declarations: [ProductDetailComponent],
  providers: [],
  exports: [ProductDetailComponent]
})
export class ProductDetailComponentModule {
}
