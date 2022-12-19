import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { Cliente } from 'src/app/app.interfaces';
import { ModalEliminarUserComponent } from 'src/app/components/modal-eliminar-user/modal-eliminar-user.component';
import { ModalFormUserComponent } from '../../../components/modal-form-user/modal-form-user.component';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.scss']
})
export class UsuariosComponent implements OnInit, AfterViewInit, OnDestroy {

  clientes: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  //TODO: Cambiar el tipo de dato por Cliente
  constructor(private modal: NgbModal, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50, 100],
      responsive: true,
      processing: true,
    };
  }
  
  ngAfterViewInit(): void {
    
    this.getData();
  }

  getData() {
    this.firestoreSvc.getDocs<Cliente>('Clientes').subscribe((clientes) => {
      this.clientes = clientes;
      this.dtTrigger.next(null);
    });
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

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
