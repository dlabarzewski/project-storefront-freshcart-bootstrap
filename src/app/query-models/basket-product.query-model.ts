export interface BasketProductQueryModel {
  readonly id: string;
  readonly imageUrl: string;
  readonly name: string;
  readonly price: number;
  readonly quantity: number;
  readonly subtotal: number;
}
