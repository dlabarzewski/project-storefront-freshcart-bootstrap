import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BasketComponent } from './basket.component';

@NgModule({
  imports: [RouterModule, CommonModule],
  declarations: [BasketComponent],
  providers: [],
  exports: [BasketComponent]
})
export class BasketComponentModule {
}
