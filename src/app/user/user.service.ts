import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { throwError, from, BehaviorSubject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private rootUrl = environment.apiBaseUrl;
  cartCount=new BehaviorSubject<any>(null);

  constructor(private httpClient: HttpClient) { }
  
  getProducts() {
    return this.httpClient.get(this.rootUrl + 'products').pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  addProduct(Name: string, Description: string, Price: number, image: File) {
    const formData = new FormData();
    formData.append('Name', Name);
    formData.append('Description', Description);
    formData.append('image', image);
    formData.append('Price', Price.toString())
    return this.httpClient.post(this.rootUrl + 'addProduct', formData).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  updateProduct(Name: string, Description: string, Price: number, image: File | string, userId) {
    let formData;
    if (typeof image === "object") {
      formData = new FormData();
      formData.append('UserId', userId)
      formData.append('Name', Name);
      formData.append('Description', Description);
      formData.append("image", image);
      formData.append('Price', Price.toString());
    } else {
      formData = {
        UserId: userId,
        Name: Name,
        Description: Description,
        ImageUrl: image,
        Price: Price.toString()
      }
    }

    return this.httpClient.put(this.rootUrl + 'updateProduct/' + userId, formData).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  deleteProduct(id: string) {
    return this.httpClient.delete(this.rootUrl + 'deleteProduct/' + id).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  getCart() {
    return this.httpClient.get(this.rootUrl + 'getCart').pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  addToCart(productId: string) {
    return this.httpClient.post(this.rootUrl + 'addToCart', { productId: productId }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  getCartCount() {
    return this.httpClient.get(this.rootUrl + 'getCartCount').pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  deleteCartItem(productId: string) {
    return this.httpClient.post(this.rootUrl + 'removeFromCart', { productId: productId }).pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  addOrder() {
    return this.httpClient.get(this.rootUrl + 'addOrder').pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  getOrders() {
    return this.httpClient.get(this.rootUrl + 'getOrders').pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  checkout() {
    return this.httpClient.get(this.rootUrl + 'checkout').pipe(
      catchError(this.handleError),
      map((response: any) => {
        return response;
      })
    )
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(error);
  }
}
