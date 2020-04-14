import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../user.service';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  public productForm: FormGroup;
  public imagePreview;
  public image;
  constructor(private userService: UserService, private formValidationService: FormValidationService
    , private toast: ToastrService, private router: Router) { }

  ngOnInit(): void {
    this.createFormControl();
  }

  createFormControl(): void {
    this.productForm = new FormGroup({
      Name: new FormControl('', [Validators.required]),
      Description: new FormControl('', [Validators.required]),
      ImageUrl: new FormControl({}, [Validators.required]),
      Price: new FormControl('', [Validators.required])
    })
  }

  public addProduct(): void {
    if (this.productForm.valid) {
      this.userService.addProduct(this.productForm.value.Name, this.productForm.value.Description, this.productForm.value.Price, this.image).subscribe(
        (response: any) => {
          this[response.responseMethod](response);
        }
      ),
        (error: HttpErrorResponse) => {
          console.log(error);
        }
    } else {
      this.formValidationService.validateAllFormFields(this.productForm);
    }
  }

  public onFileChange(event) {
    const file = event.target.files[0];
    this.productForm.patchValue({ ImageUrl: file });
    this.productForm.get("ImageUrl").updateValueAndValidity();
    this.image = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  private productAdd_success(response: any) {
    this.toast.success(response.responseBodyText, response.responseHeaderText);
    this.router.navigate(['/user/products'])
  }

}
