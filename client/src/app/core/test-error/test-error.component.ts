import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-test-error',
  templateUrl: './test-error.component.html',
  styleUrls: ['./test-error.component.scss']
})
export class TestErrorComponent {

  baseUrl = environment.apiUrl;
  validationErrors: any;

  constructor(private httpClient: HttpClient) { }

  get404Error(){
    return this.httpClient.get(this.baseUrl + 'products/42')
                          .subscribe(
                            { 
                              next: response => {
                                console.log(response);
                              },
                              error: error => console.log(error)
                            });
  }

  get500Error(){
    return this.httpClient.get(this.baseUrl + 'buggy/servererror')
                          .subscribe(
                            { 
                              next: response => {
                                console.log(response);
                              },
                              error: error => console.log(error)
                            });
  }

  get400Error(){
    return this.httpClient.get(this.baseUrl + 'buggy/badrequest')
                          .subscribe(
                            { 
                              next: response => {
                                console.log(response);
                              },
                              error: error => console.log(error)
                            });
  }

  get400ValidationError(){
    return this.httpClient.get(this.baseUrl + 'products/fortytwo')
                          .subscribe(
                            {
                              next: 
                                response => {
                                console.log(response);
                              },
                              error: 
                                error => {
                                  console.log(error);
                                  this.validationErrors = error.errors;
                                }
                            });
  }
}
