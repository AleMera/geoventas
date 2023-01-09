import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavBarComponent } from './nav-bar/nav-bar.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    NavBarComponent,
    SideMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbDropdownModule
  ],
  exports: [
    NavBarComponent,
    SideMenuComponent
  ]
})
export class SharedModule { }
