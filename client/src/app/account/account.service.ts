import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IUser } from '../shared/models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseUrl = environment.apiUrl;
  private currentUserSource = new BehaviorSubject<IUser>(null);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) { }

  getCurrentUserValue() {
    return this.currentUserSource.value;
  }

  loadCurrentUser(token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.httpClient.get(this.baseUrl + 'account', {headers}).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  login(values: any){
    return this.httpClient.post(this.baseUrl + 'account/login', values)
                          .pipe(
                            map((user: IUser) => {
                              if (user) {
                                localStorage.setItem('token', user.token);
                                this.currentUserSource.next(user);
                              }
                            })
                          );
  }

  register(values: any) {
    return this.httpClient.post(this.baseUrl + 'account/register', values)
                          .pipe(
                            map((user: IUser) => {
                              if (user) {
                                localStorage.setItem('token', user.token);
                              }
                            })
                          );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }

  checkEmailExists(email: string) {
    return this.httpClient.get(this.baseUrl + '/account/emailExists?email=' + email);
  }
}
