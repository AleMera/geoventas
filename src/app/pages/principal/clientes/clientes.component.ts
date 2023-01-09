import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { Ciudad, Cliente, Info } from 'src/app/app.interfaces';
import { ModalFormClienteComponent } from '../../../components/modal-form-cliente/modal-form-cliente.component';
import { FirestoreService } from '../../../services/firestore.service';
import { DataTableDirective } from 'angular-datatables';
import { UsuariosComponent } from '../usuarios/usuarios.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy, AfterViewInit {

  clientes: any[] = [];
  ciudad: Ciudad = {
    id: '',
    nombre: '',
    provincia: '',
  }
  ciudades: Ciudad[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtinitialized: boolean = false;

  constructor(private modal: NgbModal, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50, 100],
      responsive: false,
      processing: true,
      scrollY: '400px',
      retrieve: true,
    };
    // this.rerender();
  }
  
  ngAfterViewInit(): void {
    this.getData();
  }

  getData() {
    this.clientes = [];
    this.firestoreSvc.getDocs<Ciudad>('Ciudades').subscribe((resp) => {
      this.ciudades = resp;
    });
    this.firestoreSvc.getDocs<Cliente>('Clientes').subscribe((resp) => {
      resp.forEach((cliente) => {
        this.ciudades.find((ciudad) => {
          if (ciudad.id === cliente.idCiudad) {
            this.ciudad = ciudad;
          }
        });
        //TODO: Agregar certificados
        this.clientes.push({
          id: cliente.id,
          cedula: cliente.cedula,
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          email: cliente.email,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          ciudad: this.ciudad.nombre,
          //certificado de estudio
          //certificado de trabajo
        });
      });
      this.dtinitialized = true;
      this.dtTrigger.next(0);
    });
  }

  verInfo(idCliente: string) {
    this.modal.open(ModalFormClienteComponent, {
      scrollable: true,
      centered: true,
    }).componentInstance.idCliente = idCliente;
  }

  camposFaltantes(cliente: any) {
    if (cliente.cedula === '')
      return true;
    return false;
  }

  rerender(): void {
    if (this.dtinitialized) {
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        dtInstance.destroy();
        this.dtTrigger.next(null);
      });
    }
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
