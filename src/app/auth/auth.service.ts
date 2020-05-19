import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { AutoLogoutService } from '../shared/services/auto-logout.service';
import { User } from './user.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public User = new BehaviorSubject<User>(null);
  public setTimer;

  private rootUrl = environment.apiBaseUrl;
  constructor(private httpClient: HttpClient, private router: Router,
    private autoLogoutService: AutoLogoutService, private userService: UserService) { }

  signUp(user: any) {
    let newUser = { Name: user.Name, Email: user.Email, Password: user.Password, Cart: [] };
    return this.httpClient.post(this.rootUrl + 'signUp', newUser).pipe(
      catchError(this.handleError),
      map((response) => {
        return response;
      })
    )
  }

  signIn(user: any) {
    let newUser = { Email: user.Name, Password: user.Password };
    return this.httpClient.post(this.rootUrl + 'signIn', newUser).pipe(
      catchError(this.handleError),
      map((response: any) => {
        if (response.data) {
          let UD = new User(newUser.Email, newUser.Password, response.data.token, response.data.expiresIn);
          this.User.next(UD);
          localStorage.setItem('UD', JSON.stringify(UD));
          this.autoLogout(response.data.expiresIn * 1000);
        }
        return response;
      })
    )
  }

  forgotPassword(Email: any) {
    return this.httpClient.post(this.rootUrl + 'forgotPassword', Email).pipe(
      catchError(this.handleError),
      map((response) => {
        return response;
      })
    )
  }

  resetPassword(token: any) {
    return this.httpClient.post(this.rootUrl + 'resetPassword', { token: token }).pipe(
      catchError(this.handleError),
      map((response) => {
        return response;
      })
    )
  }

  setNewPassword(obj: any) {
    return this.httpClient.post(this.rootUrl + 'setNewPassword', obj).pipe(
      catchError(this.handleError),
      map((response) => {
        return response;
      })
    )
  }

  autoLogin() {
    const user: User = JSON.parse(localStorage.getItem('UD'));
    if (user) {
      this.User.next(user);
    }
  }

  autoLogout(expireIn: any) {
    this.setTimer = setTimeout(() => {
      this.logout();
    }, expireIn)
  }

  logout() {
    this.User.next(null);
    this.userService.cartCount.next(null);
    localStorage.removeItem('UD');
    this.router.navigate(['/signIn']);
    this.autoLogoutService.removeListener();
    clearTimeout(this.setTimer);
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
