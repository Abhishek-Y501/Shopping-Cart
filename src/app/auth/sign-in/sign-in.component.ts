import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public loginForm: FormGroup;
  constructor(private formValidationService: FormValidationService, private authService: AuthService,
    private toastr: ToastrService, private routes: Router) { }

  ngOnInit(): void {
    this.createFormControl();
  }

  private createFormControl(): void {
    this.loginForm = new FormGroup({
      Name: new FormControl('', [Validators.required, Validators.email]),
      Password: new FormControl('', [Validators.required])
    })
  }

  public submit(): void {
    if (this.loginForm.valid) {
      this.authService.signIn(this.loginForm.value).subscribe(
        (response: any) => {
          this[response.responseMethod](response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    } else {
      this.formValidationService.validateAllFormFields(this.loginForm)
    }
  }

  private signIn_Success(response: any): void {
    this.toastr.success(response.responseHeaderText, "Success!");
    this.routes.navigate(['/user/products'])
  }


  private signIn_Fail(response: any): void {
    this.toastr.error(response.responseHeaderText, "Fail!");
  }

}
