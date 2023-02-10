import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { CursosCategoriasComponent } from './cursos-categorias/cursos-categorias.component';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../components/components.module';
import { CursosModule } from './cursos/cursos.module';


@NgModule({
  declarations: [
    InicioComponent,
    NosotrosComponent,
    CursosCategoriasComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ComponentsModule,
    CursosModule,
    NgbAccordionModule,
  ],
  exports: [
    NosotrosComponent,
    CursosCategoriasComponent,
  ]
})
export class HomeModule { }
