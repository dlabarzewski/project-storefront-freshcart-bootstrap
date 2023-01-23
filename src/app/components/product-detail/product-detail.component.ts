import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { ProductModel } from '../../models/product.model';
import { ProductDetailQueryModel } from '../../query-models/product-detail.query-model';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CategoryModel } from 'src/app/models/category.model';
import { ProductDetailProductQueryModel } from 'src/app/query-models/product-detail-product.query-model';
import { ProductDetailRelatedProductQueryModel } from 'src/app/query-models/product-detail-related-product.query-model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {

  private _relatedProductsCount: number = 5;

  readonly model$: Observable<ProductDetailQueryModel> = this._activatedRoute.params.pipe(
    switchMap(
      params => combineLatest([
        this._productService.getAll(),
        this._categoryService.getAll()
      ]).pipe(
        map(
          ([products, categories]: [ProductModel[], CategoryModel[]]) => this._mapQueryModel(params['id'], products, categories)
        )
      )
    )
  )

  constructor(private _productService: ProductService, private _activatedRoute: ActivatedRoute, private _categoryService: CategoryService) {
  }

  private _mapQueryModel(productId: string, products: ProductModel[], categories: CategoryModel[]): ProductDetailQueryModel {
    const currentProduct = products.find(product => product.id === productId);

    if (currentProduct === undefined) {
      return {
        product: undefined,
        relatedProducts: []
      }
    }

    const categoriesMap = categories.reduce((a, c) => ({ ...a, [c.id]: c }), {} as Record<string, CategoryModel>);

    return {
      product: this._mapProductToQueryModel(currentProduct, categoriesMap[currentProduct.categoryId]),
      relatedProducts: products.filter(product => product.categoryId === currentProduct.categoryId)
        .slice(0, this._relatedProductsCount)
        .map(product => this._mapRelatedProductToQueryModel(product, categoriesMap[product.categoryId]))
    }
  }

  private _mapProductToQueryModel(product: ProductModel, category: CategoryModel): ProductDetailProductQueryModel {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      images: [
        '/assets/images/products/product-single-img-1.jpg',
        '/assets/images/products/product-single-img-2.jpg',
        '/assets/images/products/product-single-img-3.jpg',
        '/assets/images/products/product-single-img-4.jpg'
      ],
      category: {
        id: category.id,
        name: category.name
      },
      ratingCount: product.ratingCount,
      ratingValue: product.ratingValue,
      description: `<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Saepe ex animi sint alias ab laborum labore, perspiciatis nesciunt, ducimus qui, quia facere? Nisi assumenda, repellat repellendus impedit doloribus quia unde.</p>
      <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum rem iure, ab quia molestiae culpa alias omnis nam enim, soluta ducimus aliquid repudiandae voluptate incidunt provident, unde perspiciatis corporis eos!</p>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam eveniet magni dolorem, quisquam a, amet hic modi id itaque aut eligendi nam vitae assumenda nostrum quae vel fugiat, accusantium reiciendis.</p>`,
      informations: `<p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Earum rem iure, ab quia molestiae culpa alias omnis nam enim, soluta ducimus aliquid repudiandae voluptate incidunt provident, unde perspiciatis corporis eos!</p>
      <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsam eveniet magni dolorem, quisquam a, amet hic modi id itaque aut eligendi nam vitae assumenda nostrum quae vel fugiat, accusantium reiciendis.</p>`,
    }
  }

  private _mapRelatedProductToQueryModel(product: ProductModel, category: CategoryModel): ProductDetailRelatedProductQueryModel {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      category: {
        id: category.id,
        name: category.name
      }
    }
  }
}
