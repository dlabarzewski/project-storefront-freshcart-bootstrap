import { ProductModel } from "../models/product.model";

export interface CategoryProductsSortQueryModel {
  readonly id: number;
  readonly name: string;
  readonly sortBy: keyof ProductModel;
  readonly sortAsc: boolean;
}
