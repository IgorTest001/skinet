import { Component, OnInit } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { ShopService } from '../shop.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;

  constructor(private shopService: ShopService, 
              private activateRoute: ActivatedRoute, 
              private breadCrumbService: BreadcrumbService,
              private basketService: BasketService) { 
    this.breadCrumbService.set('@productDetails', '');
  }

  ngOnInit() {
    this.loadProduct();
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }

  incrementQuantity() {
    this.quantity++;
  }

  decrementQuantity() {
    this.quantity--;
  }

  loadProduct() {
    this.shopService.getProduct(+this.activateRoute.snapshot.paramMap.get('id'))
                    .subscribe({
                      next: product => {
                        this.product = product;
                        this.breadCrumbService.set('@productDetails', product.name);
                        // to get and display the entity-product name in the productDetailsComponent-view-breadcrumb for each of the products
                      },
                      error: error => {
                        console.log(error);
                      }
                    });
  }

}
