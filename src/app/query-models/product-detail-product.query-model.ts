import { ProductDetailCategoryQueryModel } from "./product-detail-category.query-model";

export interface ProductDetailProductQueryModel {
    readonly id: string;
    readonly name: string;
    readonly price: number;
    readonly images: string[];
    readonly category: ProductDetailCategoryQueryModel;
    readonly ratingCount: number;
    readonly ratingValue: number;
    readonly description: string;
    readonly informations: string;
}
