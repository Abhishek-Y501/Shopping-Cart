import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { take, exhaust, map } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      const authToken = JSON.parse(localStorage.getItem('user')).token;
      let modifiedHeader = request.clone({
        headers: request.headers.set("Authorization", "Bearer " + authToken)
      })
      return next.handle(modifiedHeader);
    } else {
      return next.handle(request);
    }
  }
}
