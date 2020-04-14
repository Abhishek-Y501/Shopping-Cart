import { Component, OnInit } from '@angular/core';
import { UserService } from '../../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  public products: Array<any> = [];
  constructor(private userService: UserService, private toast: ToastrService) { }

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
    console.log(response)
    this.toast.success(response.responseBodyText, response.responseHeaderText);
    this.products = response.data;
  }

}
