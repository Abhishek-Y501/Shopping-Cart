import { NgModule } from '@angular/core';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProductsComponent } from './Admin/products/products.component';
import { AddProductComponent } from './Admin/add-product/add-product.component';
import { AdminProductComponent } from './Admin/admin-product/admin-product.component';
import { ModalModule } from 'ngx-bootstrap/modal';



@NgModule({
  declarations: [UserComponent, ProductsComponent, AddProductComponent, AdminProductComponent],
  imports: [
    SharedModule,
    UserRoutingModule,
    ModalModule.forRoot()
  ]
})
export class UserModule { }
