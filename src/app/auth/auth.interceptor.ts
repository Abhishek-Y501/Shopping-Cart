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
import { take, exhaust, map, exhaustMap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authService.User.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(request);
        } else {
          if (JSON.parse(localStorage.getItem('UD'))) {
            const authToken: User = JSON.parse(localStorage.getItem('UD')).Token;
            let modifiedHeader = request.clone({
              headers: request.headers.set("Authorization", "Bearer " + authToken)
            })
            return next.handle(modifiedHeader);
          }
        }
      })
    )
  }
}
