import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core'; //, NO_ERRORS_SCHEMA
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    ShopComponent,
    ProductItemComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports:
    [ShopComponent, 
     ProductItemComponent]
})
export class ShopModule { }
