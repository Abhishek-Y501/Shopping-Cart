import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError, BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public User = new BehaviorSubject<any>(false);
  public setTimer;

  private rootUrl = environment.apiBaseUrl;
  constructor(private httpClient: HttpClient, private router: Router) { }

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
        this.User.next(true);
        localStorage.setItem('UD', JSON.stringify({ Email: user.Name, Password: user.Password }));
        localStorage.setItem('user', JSON.stringify({ token: response.data.token, expireIn: response.data.expiresIn }));
        this.autoLogout(response.data.expiresIn * 1000);
        return response;
      })
    )
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('UD'));
    if (user) {
      this.router.navigate(['/user/products']);
    } else {
      this.logout();
      this.router.navigate(['/']);
    }
  }

  autoLogout(expireIn: any) {
    this.setTimer = setTimeout(() => {
      this.logout();
    }, expireIn)
  }

  logout() {
    this.User.next(false);
    localStorage.removeItem('user');
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
