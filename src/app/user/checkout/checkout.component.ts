import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  products: Array<any> = [];
  orderForm: FormGroup;
  total: Number = 0;
  constructor(private userService: UserService, private router: Router, private formValidationService: FormValidationService) { }

  ngOnInit(): void {
    this.createFormControl();
    this.userService.checkout().subscribe(
      (response: any) => {
        console.log(response)
        this.products = response.data.products;
        this.total = response.data.total;
      },
      (error: HttpErrorResponse) => {
        console.log(error)
      }
    )
  }

  addOrder() {
    if (this.orderForm.valid) {
      this.userService.addOrder(this.orderForm.value).subscribe(
        (response: any) => {
          this.router.navigate(['/user/orders'])
          //this[response.responseMethod](response);
        },
        (error: HttpErrorResponse) => {
          console.log(error)
        }
      )
    } else {
      this.formValidationService.validateAllFormFields(this.orderForm);
    }

  }

  createFormControl(): void {
    this.orderForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      street: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      state: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      number: new FormControl('', [Validators.required])
    })
  }

}
