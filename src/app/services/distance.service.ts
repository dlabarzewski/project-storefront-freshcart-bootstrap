import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DistanceService {

  convertMetersToKilometers(meters: number): string {
    return (meters / 1000).toFixed(1)
  }
}
