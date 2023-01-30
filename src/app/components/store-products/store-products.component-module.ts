import { NgModule } from '@angular/core';
import { StoreProductsComponent } from './store-products.component';
import { SharedModule } from 'src/app/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [SharedModule, ReactiveFormsModule],
  declarations: [StoreProductsComponent],
  providers: [],
  exports: [StoreProductsComponent]
})
export class StoreProductsComponentModule {
}
