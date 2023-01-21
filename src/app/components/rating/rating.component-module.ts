import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RatingComponent } from './rating.component';

@NgModule({
  imports: [CommonModule],
  declarations: [RatingComponent],
  providers: [],
  exports: [RatingComponent]
})
export class RatingComponentModule {
}
