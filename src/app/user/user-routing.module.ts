import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ProductsComponent } from './Admin/products/products.component';
import { AddProductComponent } from './Admin/add-product/add-product.component';
import { AdminProductComponent } from './Admin/admin-product/admin-product.component';


const routes: Routes = [
  {
    path: '', component: UserComponent, children: [
      {
        path: '', pathMatch: 'full', redirectTo: '/user'
      }, {
        path: 'user', component: UserComponent, data: { title: 'User' }
      }, {
        path: 'products', component: ProductsComponent, data: { title: 'Products' }
      }, {
        path: 'addProducts', component: AddProductComponent, data: { title: 'AddProducts' }
      }, {
        path: 'adminProducts', component: AdminProductComponent, data: { title: 'AdminProducts' }
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule { }
