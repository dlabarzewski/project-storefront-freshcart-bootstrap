import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CategoryProductsComponent } from './components/category-products/category-products.component';
import { StoreProductsComponent } from './components/store-products/store-products.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { HomeComponentModule } from './components/home/home.component-module';
import { CategoryProductsComponentModule } from './components/category-products/category-products.component-module';
import { StoreProductsComponentModule } from './components/store-products/store-products.component-module';
import { ProductDetailComponentModule } from './components/product-detail/product-detail.component-module';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categories/:categoryId', component: CategoryProductsComponent },
  { path: 'stores/:storeId', component: StoreProductsComponent },
  { path: 'product/:id', component: ProductDetailComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), HomeComponentModule, CategoryProductsComponentModule, StoreProductsComponentModule, ProductDetailComponentModule],
  exports: [RouterModule],
})
export class AppRoutingModule { }
