import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IPagination } from '../shared/models/pagination';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IProduct } from '../shared/models/product';
import { ShopParams } from '../shared/models/shopParams';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:5050/api/';

  constructor(private httpClient: HttpClient) { }

  getProducts(shopParams: ShopParams){

    let params = new HttpParams();

    if (shopParams.brandId !== 0) {
      params = params.append('brandId', shopParams.brandId.toString());  // 'brandId', 'typeId', 'sort' - are allowed strings that app would put into request-params
    }                                                         // and would send it to API
                                                              // API can recognize only these values
    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    if (shopParams.typeId !== 0) {
      params = params.append('typeId', shopParams.typeId.toString());
    }

    params = params.append('sort', shopParams.sort);
    params = params.append('pageIndex', shopParams.pageNumber.toString());
    params = params.append('pageSize', shopParams.pageSize.toString());

    return this.httpClient.get<IPagination>(this.baseUrl + 'products', {observe: 'response', params})
                          .pipe(
                            map(response => {
                              return response.body;
                            })
                          );
  }

  getProduct(id: number){
    return this.httpClient.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getBrands(){
    return this.httpClient.get<IBrand[]>(this.baseUrl + 'products/brands');
  }

  getTypes(){
    return this.httpClient.get<IType[]>(this.baseUrl + 'products/types');
  }

}
