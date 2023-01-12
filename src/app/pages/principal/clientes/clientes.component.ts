import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { Ciudad, Cliente, Info } from 'src/app/app.interfaces';
import { ModalFormClienteComponent } from '../../../components/modal-form-cliente/modal-form-cliente.component';
import { FirestoreService } from '../../../services/firestore.service';
import { DataTableDirective } from 'angular-datatables';
import { UsuariosComponent } from '../usuarios/usuarios.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('ciudad') ciudadSelect: ElementRef;
  clientes: any[] = [];
  usuario: any;
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

  constructor(private modal: NgbModal, private firestoreSvc: FirestoreService, private authSvc: AuthService) { }

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
    //TODO: Quitar el campo ciudad del datatable y agregar un combo para filtrar por ciudad
    this.authSvc.getUid().then((resp) => {
      if (!resp) {
        return;
      }
      const uid = resp.uid;
      this.firestoreSvc.getDocs('Usuarios').subscribe((resp: any) => {
        this.usuario = resp.find((usuario: any) => usuario.uid === uid);
        console.log(this.usuario);
        if (this.usuario.idCiudad.length === 1) {
          console.log(this.ciudadSelect);
          this.firestoreSvc.getDoc<Ciudad>('Ciudades', this.usuario.idCiudad[0]).subscribe((resp: any) => {
            this.ciudades.push(resp);
            this.ciudadSelect.nativeElement.disabled = true;
          });
        } else {
          this.usuario.idCiudad.forEach((idCiudad: string) => {
            this.firestoreSvc.getDoc<Ciudad>('Ciudades', idCiudad).subscribe((resp: any) => {
              this.ciudades.push(resp);
            });
          });
        }

      });
    });
    this.firestoreSvc.getDocs<Cliente>('Clientes').subscribe((resp) => {
      resp.forEach((cliente) => {
        this.ciudades.find((ciudad) => {
          if (ciudad.id === cliente.idCiudad) {
            this.ciudad = ciudad;
          }
        });
        this.clientes.push({
          id: cliente.id,
          cedula: cliente.cedula,
          nombre: cliente.nombre,
          apellido: cliente.apellido,
          email: cliente.email,
          telefono: cliente.telefono,
          direccion: cliente.direccion,
          ciudad: this.ciudad.nombre,
          imgCedula: cliente.imgCedula,
          certTrabajo: cliente.certTrabajo,
          certCapacitacion: cliente.certCapacitacion,
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
      size: 'lg',
    }).componentInstance.idCliente = idCliente;
  }

  camposFaltantes(cliente: any) {
    if (!cliente.imgCedula || !cliente.certTrabajo || !cliente.certCapacitacion) {
      return true
    }
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
