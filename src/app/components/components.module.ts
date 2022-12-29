import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CursoCardComponent } from './curso-card/curso-card.component';
import { ModalFormClienteComponent } from './modal-form-cliente/modal-form-cliente.component';
import { ModalFormCursoComponent } from './modal-form-curso/modal-form-curso.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { DataTableComponent } from './data-table/data-table.component';
import { DataTablesModule } from 'angular-datatables';


@NgModule({
  declarations: [
    CursoCardComponent,
    ModalFormClienteComponent,
    ModalFormCursoComponent,
    ModalInfoComponent,
    DataTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataTablesModule,
    NgbAlertModule
  ],
  exports: [
    CursoCardComponent,
    DataTableComponent
  ]
})
export class ComponentsModule { }
