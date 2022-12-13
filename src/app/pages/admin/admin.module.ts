import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { VendedoresComponent } from './vendedores/vendedores.component';
import { CursosComponent } from './cursos/cursos.component';
import { SharedModule } from '../../shared/shared.module';
import { AdminComponent } from './admin.component';


@NgModule({
  declarations: [
    AdminComponent,
    VendedoresComponent,
    CursosComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
