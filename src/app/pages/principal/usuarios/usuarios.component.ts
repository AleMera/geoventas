import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/app.interfaces';
import { ModalEliminarUserComponent } from 'src/app/components/modal-eliminar-user/modal-eliminar-user.component';
import { ModalFormUserComponent } from '../../../components/modal-form-user/modal-form-user.component';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit {


  dtOptions: any = {};
  // dtOptions: DataTables.Settings = {};

  clientes = [
    { id: 1, nombre: 'Juan', apellido: 'Perez', email: 'juan@mail.com', curso: 'Audoimetría con certificación CAOHC' },
    { id: 2, nombre: 'Maria', apellido: 'Gomez', email: 'mari@mail.com', curso: 'Ingeniería de Drones test' },
    { id: 3, nombre: 'Carlos', apellido: 'Santos', email: 'carlos@mail.com', curso: 'Electricidad' },
    { id: 4, nombre: 'Alejandro', apellido: 'Mera', email: 'alejo@mail.com', curso: 'Audoimetría con certificación CAOHC' },
    { id: 5, nombre: 'Darío', apellido: 'Cazares', email: 'darioC@mail.com', curso: 'Refrigeración Industrial y Aire Acondicionado: Operación y Mantenimiento' },
    { id: 6, nombre: 'Sebastian', apellido: 'Villacís', email: 'sebas@mail.com', curso: 'Audoimetría con certificación CAOHC' },
    { id: 7, nombre: 'Rosa', apellido: 'Cantos', email: 'rosa@mail.com', curso: 'Testeo de drones' },
    { id: 8, nombre: 'Alberto', apellido: 'Flores', email: 'albert@mail.com', curso: 'Audoimetría con certificación CAOHC' },
    { id: 9, nombre: 'Sylvia', apellido: 'Rodriguez', email: 'sylvi@mail.com', curso: 'Refrigeración Industrial y Aire Acondicionado: Operación y Mantenimiento' },
    { id: 10, nombre: 'Carmen', apellido: 'De la Cruz', email: 'carmen@mail.com', curso: 'Asistencia de seguridad industrial' },
    { id: 11, nombre: 'Roberto', apellido: 'Miranda', email: 'robertM@mail.com', curso: 'Refrigeración Industrial y Aire Acondicionado: Operación y Mantenimiento' },
    { id: 12, nombre: 'Elizabeth', apellido: 'Delgado', email: 'eliDel@mail.com', curso: 'Mantenimiento de generadores' },
  ];
  constructor(private modal: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      pageLength: 5,
    };
  }

  editar(cliente: any) {
    this.modal.open(ModalFormUserComponent, {
      scrollable: true,
      centered: true,
    }).componentInstance.cliente = cliente; 
  }

  eliminar(id: number) {
    this.modal.open(ModalEliminarUserComponent, {
      centered: true,
    }).componentInstance.id = id;
  }

  nuevo() {
    this.modal.open(ModalFormUserComponent, {
      scrollable: true,
      centered: true,
    })
  }

  abrirModal(id: number) {
    alert('Abrir modal');
  }

}
