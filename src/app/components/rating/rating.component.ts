import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingComponent {
  @Input('ratingValue') ratingValue: number = 0;

  readonly values: Observable<number[]> = of([1, 2, 3, 4, 5]);
}
