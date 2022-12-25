import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InicioComponent } from './pages/inicio/inicio.component';

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then(m => m.PrincipalModule),
  },
  {
    path: 'cursos',
    loadChildren: () => import('./pages/cursos/cursos.module').then(m => m.CursosModule),
  },
  {
    path: 'admin',
    loadChildren: () => import('./pages/admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: '**',
    redirectTo: 'inicio'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
