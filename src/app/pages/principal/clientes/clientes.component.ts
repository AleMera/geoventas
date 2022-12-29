import { Component, OnInit, OnDestroy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { Cliente } from 'src/app/app.interfaces';
import { ModalFormClienteComponent } from '../../../components/modal-form-cliente/modal-form-cliente.component';
import { FirestoreService } from '../../../services/firestore.service';
import { ModalInfoComponent } from '../../../components/modal-info/modal-info.component';
import { Info } from '../../auth/registro/registro.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy {

  clientes: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();


  //TODO: Cambiar el tipo de dato por Cliente
  constructor(private modal: NgbModal, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.getData();
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50, 100],
      responsive: true,
      processing: true,
      scrollY: '400px',
      // scrollCollapse: true,
    };
  }
  
  getData() {
    this.firestoreSvc.getDocs<Cliente>('Clientes').subscribe((clientes) => {
      this.clientes = clientes;
      this.dtTrigger.next(null);
    });
  }

  editar(cliente: any) {
    this.modal.open(ModalFormClienteComponent, {
      scrollable: true,
      centered: true,
    }).componentInstance.cliente = cliente;
  }

  eliminar(uid: string) {
    console.log(uid);

    const info: Info = {
      tipo: 'Eliminar',
      icono: 'warning',
      titulo: 'Eliminar usuario',
      mensaje: '¿Está seguro que desea eliminar este usuario? \n Esta acción no se puede deshacer.',
      id: uid
    }
    this.modal.open(ModalInfoComponent).componentInstance.info = info;
  }

  nuevo() {
    this.modal.open(ModalFormClienteComponent, {
      scrollable: true,
      centered: true,
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
