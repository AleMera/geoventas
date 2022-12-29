import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapaComponent } from './mapa/mapa.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrincipalComponent } from './principal.component';
import { ClientesComponent } from './clientes/clientes.component';
import { CursosComponent } from './cursos/cursos.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AuthGuard } from '@angular/fire/auth-guard';

const routes: Routes = [
  {
    path: '',
    component: PrincipalComponent,
    children: [
      {
        path: 'mapa',
        component: MapaComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'clientes',
        component: ClientesComponent
      },
      {
        path: 'cursos',
        component: CursosComponent,
        canActivateChild: [AuthGuard]
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        canActivateChild: [AuthGuard]
      }
    ],
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class PrincipalRoutingModule { }
