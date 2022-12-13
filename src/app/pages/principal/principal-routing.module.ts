import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MapaComponent } from './mapa/mapa.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PrincipalComponent } from './principal.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { CursosComponent } from './cursos/cursos.component';

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
        path: 'usuarios',
        component: UsuariosComponent
      },
      {
        path: 'cursos',
        component: CursosComponent
      }
    ],
  },
  {
    path: '**',
    redirectTo: 'mapa'
  }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class PrincipalRoutingModule { }
