import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance'
})
export class DistancePipe implements PipeTransform {

  transform(meters: number, target: string = 'm', roundTo: number = 0): string {

    let factor: number = 1;

    if (target === 'km') {
      factor = 0.001;
    }

    let converted = meters * factor;

    return converted.toFixed(roundTo);
  }

}
