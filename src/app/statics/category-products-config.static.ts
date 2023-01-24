import { CategoryProductsSortQueryModel } from "../query-models/category-products-sort.query-model";
import { ProductSorting } from "./product-sorting.static";

export const CategoryProductsConfig : {
  defaultLimit: number,
  sortings: CategoryProductsSortQueryModel[],
  ratingOptions: number[],
  pageSizeOptions: number[],
} = {
  defaultLimit: 5,

  sortings: [
    { id: ProductSorting.featureValueDesc, name: 'Featured', sortBy: 'featureValue', sortAsc: false },
    { id: ProductSorting.priceAsc, name: 'Price: Low to High', sortBy: 'price', sortAsc: true },
    { id: ProductSorting.priceDesc, name: 'Price: High to Low', sortBy: 'price', sortAsc: false },
    { id: ProductSorting.ratingValueDesc, name: 'Avg. Rating', sortBy: 'ratingValue', sortAsc: false }
  ],

  ratingOptions: [5, 4, 3, 2, 1],

  pageSizeOptions: [5, 10, 15],
}