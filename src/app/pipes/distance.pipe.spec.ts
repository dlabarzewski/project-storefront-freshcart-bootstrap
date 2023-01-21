import { DistancePipe } from './distance.pipe';

describe('DistancePipe', () => {
  const pipe = new DistancePipe();
  
  it('doesnt convert when no args provided', () => {
    expect(pipe.transform(123)).toBe('123');
  });
  
  it('converts meters to kms', () => {
    expect(pipe.transform(1234, 'km')).toBe('1');
  });
  
  it('converts meters to kms and rounds', () => {
    expect(pipe.transform(1274, 'km', 1)).toBe('1.3');
  });
});
