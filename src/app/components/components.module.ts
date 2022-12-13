import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { CursoCardComponent } from './curso-card/curso-card.component';
import { ModalEliminarUserComponent } from './modal-eliminar-user/modal-eliminar-user.component';
import { ModalFormUserComponent } from './modal-form-user/modal-form-user.component';


@NgModule({
  declarations: [
    CursoCardComponent,
    ModalEliminarUserComponent,
    ModalFormUserComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbAlertModule
  ],
  exports: [
    CursoCardComponent,
  ]
})
export class ComponentsModule { }
