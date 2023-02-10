import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CursosRoutingModule } from './cursos-routing.module';
import { InfoCursoComponent } from '././info-curso/info-curso.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    InfoCursoComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CursosRoutingModule,
    SharedModule
  ]
})
export class CursosModule { }
