import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataTablesModule } from 'angular-datatables';
import { NgChartsModule } from 'ng2-charts';

import { PrincipalRoutingModule } from './principal-routing.module';
import { PrincipalComponent } from './principal.component';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../components/components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { MapaComponent } from './mapa/mapa.component';


@NgModule({
  declarations: [
    PrincipalComponent,
    DashboardComponent,
    UsuariosComponent,
    MapaComponent
  ],
  imports: [
    CommonModule,
    PrincipalRoutingModule,
    DataTablesModule,
    SharedModule,
    ComponentsModule,
    NgChartsModule
  ]
})
export class PrincipalModule { }
