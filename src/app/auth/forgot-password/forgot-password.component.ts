import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  public forgotPasswordForm: FormGroup;
  public isLinkSent: boolean = false;
  constructor(private formValidationService: FormValidationService, private toastService: ToastrService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.createFormControl();
  }

  submit(): void {
    if (this.forgotPasswordForm.valid) {
      this.authService.forgotPassword(this.forgotPasswordForm.value).subscribe(
        (response: any) => {
          this[response.responseMethod](response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    } else {
      this.formValidationService.validateAllFormFields(this.forgotPasswordForm);
    }
  }

  forgotPassword_Fail(error) {
    this.toastService.error(error.responseHeaderText, "Error!");
  }

  forgotPassword_Success(response) {
    console.log(response);
    this.toastService.success(response.responseHeaderText, "Success!");
    this.isLinkSent = true;
    setTimeout(() => {
      this.isLinkSent = false;
    }, 5000)
  }

  createFormControl(): void {
    this.forgotPasswordForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email])
    })
  }

}
