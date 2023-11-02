import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, catchError, delay, throwError } from 'rxjs';
import { NavigationExtras, Route, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(request).pipe(
      catchError(errorInput => {
        if (errorInput) {
          if (errorInput.status === 400){
            if (errorInput.error.errors){
              throw errorInput.error;
            }
            else
            {
              this.toastr.error(errorInput.error.message, errorInput.error.statusCode);
            }
          }
          if (errorInput.status === 401){
            this.toastr.error(errorInput.error.message, errorInput.error.statusCode);
          }
          if (errorInput.status === 404){
            this.router.navigateByUrl('/not-found');
          }
          if (errorInput.status === 500){
            const navigationExtras: NavigationExtras = {state: {error: errorInput.error}};
            this.router.navigateByUrl('/server-error', navigationExtras);
          }
        }
        return throwError(() => new Error(errorInput.message));
      })
    )
  }
}