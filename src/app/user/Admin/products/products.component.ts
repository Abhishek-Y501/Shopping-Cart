import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products: Array<any> = [];
  constructor(private userService: UserService, private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getProducts().subscribe(
      (response: any) => {
        this[response.responseMethod](response);
      }
    ),
      (error: HttpErrorResponse) => {
        console.log(error);
      }
  }

  private product_success(response: any) {
    this.toast.success(response.responseBodyText, response.responseHeaderText);
    this.products = response.data;
  }

  addToCart(id): void {
    this.userService.addToCart(id).subscribe(
      (response: any) => {
        this[response.responseMethod](response);
      },
      (error: HttpErrorResponse) => {
        console.log(error)
      }
    )
  }

  addToCart_success(response: any) {
    this.toast.success(response.responseBodyText, response.responseHeaderText);
    this.router.navigate(['/user/cart']);
  }

}
