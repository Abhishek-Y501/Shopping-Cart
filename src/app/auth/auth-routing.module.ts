import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


const routes: Routes = [
  {
    path: '', component: AuthComponent, children: [
      {
        path: '', pathMatch: 'full', redirectTo: '/signIn'
      }, {
        path: 'signIn', component: SignInComponent, data: { title: 'signIn' }
      }, {
        path: 'signUp', component: SignUpComponent, data: { title: 'signUp' }
      }, {
        path: 'forgotPassword', component: ForgotPasswordComponent, data: { title: 'Forgot Password' }
      },
      {
        path: 'resetPassword/:token', component: ResetPasswordComponent, data: { title: 'Reset Password' }
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AuthRoutingModule { }
