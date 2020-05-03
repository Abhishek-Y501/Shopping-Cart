import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss']
})
export class ViewProductComponent implements OnInit {
  productId: string;
  product: any = {
    _id: '',
    Name: '',
    Description: '',
    Price: 0
  };
  isResponse: boolean = false;
  constructor(private activatedRoute: ActivatedRoute, private userService: UserService,
    private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      params => {
        this.productId = params['id'];
        console.log(this.productId)
        this.productById();
      }
    )
  }

  productById() {
    this.userService.productById(this.productId).subscribe(
      (response: any) => {
        console.log(response)
        this.product = response.data;
        this.isResponse = true;
      }, (error: HttpErrorResponse) => {
        console.log(error);
      }
    )
  }

  addToCart(): void {
    this.userService.addToCart(this.productId).subscribe(
      (response: any) => {
        this[response.responseMethod](response);
      },
      (error: HttpErrorResponse) => {
        console.log(error)
      }
    )
  }

  goToProducts(): void {
    this.router.navigate(['/user/products']);
  }

  addToCart_success(response: any) {
    this.toast.success(response.responseBodyText, response.responseHeaderText);
    this.router.navigate(['/user/cart']);
  }

}
