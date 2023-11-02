import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { HttpClient } from '@angular/common/http';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;

  private basketSource = new BehaviorSubject<IBasket>(null);
  basket$ = this.basketSource.asObservable();

  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basketTotals$ = this.basketTotalSource.asObservable();

  constructor(private httpClient: HttpClient) { }

  getBasket(id: string){

    return this.httpClient.get(this.baseUrl + 'basket?id=' + id)
                .pipe(
                  map((basket: IBasket) => {
                    this.basketSource.next(basket);
                  })
                );
  }

  setBasket(basket: IBasket){
    return this.httpClient.post(this.baseUrl + 'basket', basket)
                          .subscribe({                            // This is where HTTP request is executed .subscribe()-method is used to handle the response from HTTP-request
                            next: (response: IBasket) => {        // This is a callback-function (aka Observer-function) that is executed when HTTP-request is successful.
                                this.basketSource.next(response); // So, first we set/save the basket to the server-storage and receive the response-data from API using POST-request 
                                this.calculateTotals();  // and then next:callback-function emits "response" through the 'basketSource' which serves as the source for other components.
                              },                  
                            error: error => {
                                console.log(error);
                              }
                            });
  }

  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }
  
  decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(x => x.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }
  
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id !== item.id)) {
      basket.items = basket.items.filter(i => i.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket);
      }
    }
  }
  
  deleteBasket(basket: IBasket) {
    return this.httpClient.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe({
                                                                            next: () => {
                                                                              this.basketSource.next(null);
                                                                              this.basketTotalSource.next(null);
                                                                              localStorage.removeItem('basket_id');
                                                                            },
                                                                            error: error => {
                                                                              console.log(error);
                                                                            }
                                                                          });
  }

  public calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subtotal + shipping;
    this.basketTotalSource.next({shipping, total, subtotal});
  }

  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(item => item.id === itemToAdd.id);
    if (index === -1) {   // no items found in the items of the existing basket
      itemToAdd.quantity = quantity; 
      items.push(itemToAdd);
    } else {              // the input itemToAdd already exists in the current existing basket
      items[index].quantity += quantity; // so we need just to increase the quantity of the added items in the basket
    }
    return items;
  }

  createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    }
  }
}
