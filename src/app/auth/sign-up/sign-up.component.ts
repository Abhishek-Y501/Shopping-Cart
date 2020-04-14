import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {
  public signupForm: FormGroup;
  constructor(private formValidationService: FormValidationService,
    private authService: AuthService,
    private toastr: ToastrService, private routes: Router) { }

  ngOnInit(): void {
    this.createFormControl();
  }

  private createFormControl(): void {
    this.signupForm = new FormGroup({
      Email: new FormControl('', [Validators.required, Validators.email]),
      Name: new FormControl('', [Validators.required]),
      Password: new FormControl('', [Validators.required])
    })
  }

  public submit(): void {
    if (this.signupForm.valid) {
      this.authService.signUp(this.signupForm.value).subscribe(
        (response: any) => {
          this[response.responseMethod](response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    } else {
      this.formValidationService.validateAllFormFields(this.signupForm)
    }
  }

  private signUp_Success(response: any): void {
    this.toastr.success(response.responseHeaderText, "Success!");
    this.routes.navigate(['/signIn']);
  }

  private signUp_Fail(response: any): void {
    this.toastr.error(response.responseHeaderText, "Fail!");
  }

}
