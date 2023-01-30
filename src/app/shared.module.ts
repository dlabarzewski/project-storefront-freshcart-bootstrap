import { NgModule } from '@angular/core';
import { DistancePipe } from './pipes/distance.pipe';
import { TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { httpTranslateLoader } from './factories/http-translate-loader.factory';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpTranslateLoader,
        deps: [HttpClient]
      }
    }),
    CommonModule,
    RouterModule,
  ],
  declarations: [DistancePipe],
  exports: [DistancePipe, TranslatePipe, CommonModule, RouterModule],
})
export class SharedModule { }
