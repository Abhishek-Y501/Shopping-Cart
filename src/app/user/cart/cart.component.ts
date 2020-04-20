import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartProducts: Array<any> = [];
  constructor(private userService: UserService, private toast: ToastrService,private router:Router) { }

  ngOnInit(): void {
    this.getCart();
  }

  getCart() {
    this.userService.getCart().subscribe(
      (response: any) => {
        this[response.responseMethod](response);
      },
      (error: HttpErrorResponse) => {
        console.log(error)
      }
    )
  }

  getCart_success(response: any) {
    this.cartProducts = response.data;
    this.getCartCount();
  }

  getCartCount() {
    this.userService.getCartCount().subscribe(
      (response: any) => {
        this[response.responseMethod](response);
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  getCartCount_success(response: any) {
    this.userService.cartCount.next(response.data);
  }

  deleteCartItem(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then((result) => {
      if (result.value) {
        this.userService.deleteCartItem(id).subscribe(
          (response: any) => {
            this[response.responseMethod](response);
          },
          (error: HttpErrorResponse) => {
            console.log(error)
          }
        )
      }
    })
  }

  buyNow() {
    this.router.navigate(['/user/checkout']);
  }

  removeFromCart_success(response: any) {
    this.toast.warning(response.responseBodyText, response.responseHeaderText);
    this.getCart();
  }

}
