import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'app-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent implements OnInit{
  breadscrumb$: Observable<any[]>;
  constructor(private breadscrumbService: BreadcrumbService) { }

  ngOnInit(): void {
    this.breadscrumb$ = this.breadscrumbService.breadcrumbs$;
  }

}
