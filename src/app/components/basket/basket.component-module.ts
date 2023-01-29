import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared.module';
import { BasketComponent } from './basket.component';

@NgModule({
  imports: [SharedModule, TranslateModule],
  declarations: [BasketComponent],
  providers: [],
  exports: [BasketComponent]
})
export class BasketComponentModule {
}
