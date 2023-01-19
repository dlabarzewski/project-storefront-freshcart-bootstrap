import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreProductsComponent } from './store-products.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared.module';

@NgModule({
  imports: [CommonModule, RouterModule, SharedModule],
  declarations: [StoreProductsComponent],
  providers: [],
  exports: [StoreProductsComponent]
})
export class StoreProductsComponentModule {
}
