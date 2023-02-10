import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InicioComponent } from './inicio/inicio.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../shared/shared.module';
import { ComponentsModule } from '../../components/components.module';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    InicioComponent,
    NosotrosComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ComponentsModule,
    NgbAccordionModule
  ]
})
export class HomeModule { }
