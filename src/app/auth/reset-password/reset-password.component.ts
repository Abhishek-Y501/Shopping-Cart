import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { FormValidationService } from 'src/app/shared/services/form-validation.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  public resetPasswordForm: FormGroup;
  public isInvalidToken: boolean = false;
  public passwordToken = '';
  public userId = null;
  constructor(private formValidationService: FormValidationService, private toastService: ToastrService,
    private authService: AuthService, private activatedRoute: ActivatedRoute, private router: Router
    , private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createFormControl();
    this.activatedRoute.params.subscribe(
      (params) => {
        this.passwordToken = params['token'];
      }
    )

    if (this.passwordToken) {
      this.authService.resetPassword(this.passwordToken).subscribe(
        (response: any) => {
          this[response.responseMethod](response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    }
  }

  submit(): void {
    if (this.resetPasswordForm.valid) {
      let newPasswordObj = {
        NewPassword: this.resetPasswordForm.value.NewPassword,
        UserId: this.userId,
        PasswordToken: this.passwordToken
      }
      this.authService.setNewPassword(newPasswordObj).subscribe(
        (response: any) => {
          this[response.responseMethod](response);
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    } else {
      this.formValidationService.validateAllFormFields(this.resetPasswordForm);
    }
  }

  forgotPassword_Success(response) {
    this.userId = response.data.userId;
    this.isInvalidToken = false;
  }

  forgotPassword_Fail(error) {
    this.userId = null;
    this.isInvalidToken = true;
    this.toastService.error(error.responseHeaderText, "Error!");
  }

  setNewPassword_Success(response) {
    this.toastService.success(response.responseHeaderText, "Success!");
    this.router.navigate(['/signIn']);
  }

  createFormControl(): void {
    // this.resetPasswordForm = new FormGroup({
    //   NewPassword: new FormControl('', [Validators.required]),
    //   CnfPassword: new FormControl('', [Validators.required])
    // }), { validator: this.checkPasswords }

    this.resetPasswordForm = this.fb.group({
      NewPassword: ['', [Validators.required]],
      CnfPassword: ['', [Validators.required]]
    }, { validator: this.checkPasswords })
  }



  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    console.log(group)
    let pass = group.get('NewPassword').value;
    let confirmPass = group.get('CnfPassword').value;
    return pass === confirmPass ? null : { mismatch: true }
  }
}
