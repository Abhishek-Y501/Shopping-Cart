import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  public orders: any = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getOrders().subscribe(
      (response: any) => {
        console.log(response);
        this.orders = response.data;
        this.getCartCount();
      },
      (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
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

}
