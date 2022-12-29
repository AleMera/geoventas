import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectLoggedInTo, redirectUnauthorizedTo, canActivate } from "@angular/fire/compat/auth-guard";

import { InicioComponent } from './pages/inicio/inicio.component';
import { DataTableComponent } from './components/data-table/data-table.component';

const redirectUnauthorizedToAuth = () => redirectUnauthorizedTo(['auth']);
const redirectLoggedInToPrincipal = () => redirectLoggedInTo(['principal']);

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
    ...canActivate(redirectLoggedInToPrincipal)
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    ...canActivate(redirectLoggedInToPrincipal)
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then(m => m.PrincipalModule),
    ...canActivate(redirectUnauthorizedToAuth),
  },
  {
    path: 'cursos',
    loadChildren: () => import('./pages/cursos/cursos.module').then(m => m.CursosModule),
  },
  {
    path: 'datatable',
    component: DataTableComponent
  },
  {
    path: '**',
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
