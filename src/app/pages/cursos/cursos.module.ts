import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { InfoCursoComponent } from './info-curso/info-curso.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    InfoCursoComponent
  ],
  imports: [
    CommonModule,
    CursosRoutingModule,
    SharedModule
  ]
})
export class CursosModule { }
