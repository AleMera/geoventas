import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VendedoresComponent } from './vendedores/vendedores.component';
import { CursosComponent } from './cursos/cursos.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'vendedores',
        component: VendedoresComponent
      },
      {
        path: 'cursos',
        component: CursosComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'vendedores'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
