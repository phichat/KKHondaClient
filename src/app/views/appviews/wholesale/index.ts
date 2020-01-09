import { components as sale } from './sale-form';
import { components as booking } from './booking-form';

export const components: any[] = [
  ...sale,
  ...booking
]

export * from './booking-form';
export * from './sale-form';