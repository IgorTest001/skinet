import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ShopService } from './shop.service';
import { IProduct } from '../shared/models/product';
import { IBrand } from '../shared/models/brand';
import { IType } from '../shared/models/productType';
import { ShopParams } from '../shared/models/shopParams';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  @ViewChild('search', {static: true}) searchTerm: ElementRef;
  products : IProduct[];
  brands: IBrand[];
  types: IType[];
  shopParams = new ShopParams();
  totalCount: number;

  sortOptions = [
    {name: 'Alphabetic', value: 'name'},              // 'name', 'priceAsc', 'priceDesc' - front-client-component gets this values to put one of them into API-request's params 
    {name: 'Price: Low to High', value: 'priceAsc'},  // API recognizes only one of these value-string to create and perform the query on the server-side.
    {name: 'Price: High to Low', value: 'priceDesc'}
  ];

  constructor(private shopService: ShopService) {}

  ngOnInit(){
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({ 
                                    next: response => {
                                      this.products = response.data;
                                      this.shopParams.pageNumber = response.pageIndex;
                                      this.shopParams.pageSize = response.pageSize;
                                      this.totalCount = response.count;
                                    },
                                    error: error => console.log(error)
                                  });
  }

  getBrands(){
    this.shopService.getBrands().subscribe( response =>
      this.brands = [{id: 0, name: 'All'}, ...response]);
  }

  getTypes(){
    this.shopService.getTypes().subscribe( response =>
      this.types = [{id: 0, name: 'All'}, ...response]);
  }

  onBrandSelected(brandId: number){
    this.shopParams.brandId = brandId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onTypeSelected(typeId: number){
    this.shopParams.typeId = typeId;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onSortSelected(sort: string){
    this.shopParams.sort = sort;
    this.getProducts();
  }

  onPageChanged(page: any){
    if (this.shopParams.pageNumber !== page) {
      this.shopParams.pageNumber = page;
      this.getProducts();      
    }
  }

  onSearch() { 
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.getProducts();
  }
}
