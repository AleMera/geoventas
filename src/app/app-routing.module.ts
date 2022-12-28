import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { redirectLoggedInTo, redirectUnauthorizedTo, canActivate } from "@angular/fire/compat/auth-guard";
// import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

import { InicioComponent } from './pages/inicio/inicio.component';

const redirectUnauthorizedToAuth = () => redirectUnauthorizedTo(['auth']);
const redirectLoggedInToPrincipal = () => redirectLoggedInTo(['principal']);
// const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['auth']);
// const redirectLoggedInToPrincipal = () => redirectLoggedInTo(['principal']);

const routes: Routes = [
  {
    path: 'inicio',
    component: InicioComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then(m => m.AuthModule),
    ...canActivate(redirectLoggedInToPrincipal)
    // ...canActivate(redirectLoggedInToPrincipal)
  },
  {
    path: 'principal',
    loadChildren: () => import('./pages/principal/principal.module').then(m => m.PrincipalModule),
    ...canActivate(redirectUnauthorizedToAuth)
    // ...canActivate(redirectUnauthorizedToLogin)
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
    redirectTo: 'inicio',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
