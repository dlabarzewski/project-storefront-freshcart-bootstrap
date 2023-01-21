import { NgModule } from '@angular/core';
import { DistancePipe } from './pipes/distance.pipe';

@NgModule({
  imports: [],
  declarations: [DistancePipe],
  exports: [DistancePipe],
})
export class SharedModule { }
