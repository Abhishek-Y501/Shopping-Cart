import { Component, OnInit, TemplateRef } from '@angular/core';
import { UserService } from '../../user.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';

@Component({
  selector: 'app-admin-product',
  templateUrl: './admin-product.component.html',
  styleUrls: ['./admin-product.component.scss']
})
export class AdminProductComponent implements OnInit {
  public products: Array<any> = [];
  bsModalRef: BsModalRef;
  public productForm: FormGroup;
  public image;
  public imagePreview;
  public userId;
  constructor(private userService: UserService, private toast: ToastrService,
    private modalService: BsModalService, private formValidationService: FormValidationService) { }

  ngOnInit(): void {
    this.getProducts();
    this.createFormControl();
  }

  ngbModalOptions: ModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  createFormControl(): void {
    this.productForm = new FormGroup({
      Name: new FormControl('', [Validators.required]),
      Description: new FormControl('', [Validators.required]),
      ImageUrl: new FormControl(null, [Validators.required]),
      Price: new FormControl('', [Validators.required])
    })
  }

  private getProducts() {
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

  public editProduct(template: TemplateRef<any>, product): void {
    console.log(product);
    this.bsModalRef = this.modalService.show(template, this.ngbModalOptions);
    this.imagePreview = product.ImageUrl;
    this.image = product.ImageUrl;
    this.userId = product._id;
    this.productForm.patchValue({
      Name: product.Name,
      Description: product.Description,
      Price: product.Price,
      ImageUrl: product.ImageUrl
    })
    this.productForm.get("ImageUrl").updateValueAndValidity();
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

  public updateProduct(): void {
    if (this.productForm.valid) {
      this.userService.updateProduct(this.productForm.value.Name, this.productForm.value.Description, this.productForm.value.Price, this.image, this.userId).subscribe(
        (response: any) => {
          this[response.responseMethod](response);
          console.log(response);
        }
      ),
        (error: HttpErrorResponse) => {
          console.log(error);
        }
    } else {
      this.formValidationService.validateAllFormFields(this.productForm);
    }
  }

  public productUpdated_success(response: any) {
    this.toast.success(response.responseBodyText, response.responseHeaderText);
    this.bsModalRef.hide();
    this.getProducts();
  }

  public deleteProduct(id: string): void {
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
        this.userService.deleteProduct(id).subscribe(
          (response: any) => {
            this[response.responseMethod](response);
          }
        ), (error: HttpErrorResponse) => {
          console.log(error)
        }
      }
    })
  }

  private productDelete_success(response: any) {
    this.toast.warning(response.responseBodyText, response.responseHeaderText);
    this.getProducts();
  }
}
