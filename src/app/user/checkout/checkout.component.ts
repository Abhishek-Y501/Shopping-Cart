import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products: Array<any> = [];
  total:Number=0;
  constructor(private userService: UserService,private router:Router) { }

  ngOnInit(): void {
    this.userService.checkout().subscribe(
      (response: any) => {
        console.log(response)
        this.products = response.data.products;
        this.total=response.data.total;
      },
      (error: HttpErrorResponse) => {
        console.log(error)
      }
    )
  }

  addOrder() {
    this.userService.addOrder().subscribe(
      (response: any) => {
        this.router.navigate(['/user/orders'])
        //this[response.responseMethod](response);
      },
      (error: HttpErrorResponse) => {
        console.log(error)
      }
    )
  }

}
