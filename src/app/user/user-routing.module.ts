import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { ProductsComponent } from './Admin/products/products.component';
import { AddProductComponent } from './Admin/add-product/add-product.component';
import { AdminProductComponent } from './Admin/admin-product/admin-product.component';
import { CartComponent } from './cart/cart.component';
import { OrdersComponent } from './orders/orders.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
  {
    path: '', component: UserComponent, canActivateChild: [AuthGuard],
    children: [
      {
        path: '', pathMatch: 'full', redirectTo: '/user'
      },
      {
        path: 'user', component: UserComponent, data: { title: 'User' }
      },
      {
        path: 'products', component: ProductsComponent, data: { title: 'Products' }
      },
      {
        path: 'addProducts', component: AddProductComponent, data: { title: 'AddProducts' }
      },
      {
        path: 'adminProducts', component: AdminProductComponent, data: { title: 'AdminProducts' }
      },
      {
        path: 'cart', component: CartComponent, data: { title: 'Cart' }
      },
      {
        path: 'orders', component: OrdersComponent, data: { title: 'Orders' }
      },
      {
        path: 'checkout', component: CheckoutComponent, data: { title: 'Checkout' }
      },
      {
        path: 'viewProduct', component: ViewProductComponent, data: { title: 'ViewProduct' }
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
