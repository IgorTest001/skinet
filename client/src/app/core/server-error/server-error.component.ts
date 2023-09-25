import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.scss']
})
export class ServerErrorComponent implements OnInit{
  errorInternal: any;
  
  // NavigationExtras from the ErrorInterceptop is only available in the Constructor
  constructor(private router: Router) { 
    
    const navigation = this.router.getCurrentNavigation();
    
    this.errorInternal = navigation?.extras?.state?.error;
  }

  ngOnInit(): void {
    
  }

}
