import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { Ciudad, Cliente, Info } from 'src/app/app.interfaces';
import { ModalFormClienteComponent } from '../../../../components/modal-form-cliente/modal-form-cliente.component';
import { FirestoreService } from '../../../../services/firestore.service';
import { DataTableDirective } from 'angular-datatables';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent implements OnInit, OnDestroy {

  @ViewChild('ciudad') ciudadSelect: ElementRef;
  clientes: any[] = [];
  usuario: any;
  ciudades: Ciudad[] = [];
  cargando: boolean = false;

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  constructor(private modal: NgbModal, private firestoreSvc: FirestoreService, private authSvc: AuthService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      lengthMenu: [10, 25, 50, 100],
      responsive: false,
      processing: true,
      scrollY: '400px',
      retrieve: true,
    };
    this.cargarData();
  }

  cargarData() {
    this.authSvc.getUid().then((resp) => {
      if (!resp) return;
      const uid = resp.uid;
      this.firestoreSvc.getDocs('Usuarios').subscribe((resp: any) => {
        this.usuario = resp.find((usuario: any) => usuario.uid === uid);
        const ciudadesUsuario = this.usuario.idCiudad;
        //Cargar select de ciudades del usuario
        this.firestoreSvc.getDocs('Ciudades').subscribe((resp: any) => {
          this.ciudades = resp.filter((ciudad: any) => ciudadesUsuario.includes(ciudad.id));
          this.ciudades.sort(this.ordenarAlfabeticamente);
          if (this.ciudades.length === 1) {
            this.ciudadSelect.nativeElement.disabled = true;
          }
        });

        //Cargar tabla de clientes
        this.clientes = [];
        this.firestoreSvc.getDocs('Ventas').subscribe((resp: any) => {
          let ventas: any[] = [];
          console.log(this.ciudades);
          this.ciudades.forEach((ciudad: any) => {
            const venta = resp.filter((venta: any) => venta.idCiudad === ciudad.id);
            ventas = [...ventas, ...venta];
          });
          this.firestoreSvc.getDocs('Clientes').subscribe((resp: any[]) => {
            const clientes = resp.filter((cliente: any) => ventas.find((venta: any) => venta.idCliente === cliente.id));
            this.clientes = clientes;
            
            //TODO: Obtener la ciudad correctamente
            this.clientes.forEach((cliente: any, i) => {
              const venta = ventas.find((venta: any) => venta.idCliente === cliente.id);
              if (!venta) return;
              this.firestoreSvc.getDoc('Cursos', venta.idCurso).subscribe((resp: any) => {
                this.clientes[i].curso = resp.nombre;
                this.clientes[i].ciudad = this.ciudades.find((ciudad: any) => ciudad.id === venta.idCiudad)?.nombre;
                this.dtTrigger.next(null);
              });
            });
          });
        });
      });
    });
  }

  cambiarCiudad(event: any) {
    if (!event.target.value) {
      this.cargarTodo();
      return;
    }
    const ciudad = event.target.value;
    this.clientes = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.firestoreSvc.getDocs('Ventas').subscribe((resp: any) => {
      const ventas = resp.filter((venta: any) => venta.idCiudad === ciudad);
      console.log(ventas);
      if (ventas.length === 0) {
        this.clientes = [];
        this.dtTrigger.next(null);
        return;
      }
      this.firestoreSvc.getDocs('Clientes').subscribe((resp: any) => {
        const clientes = resp.filter((cliente: any) => ventas.find((venta: any) => venta.idCliente === cliente.id));
        clientes.forEach((cliente: any) => {
          const venta = ventas.find((venta: any) => venta.idCliente === cliente.id);
          this.firestoreSvc.getDoc('Cursos', venta.idCurso).subscribe((resp: any) => {
            const ciudad = this.ciudades.find((ciudad: any) => ciudad.id === venta.idCiudad);
            this.clientes.push({
              id: cliente.id,
              cedula: cliente.cedula,
              nombre: cliente.nombre,
              apellido: cliente.apellido,
              email: cliente.email,
              telefono: cliente.telefono,
              direccion: cliente.direccion,
              ciudad: ciudad?.nombre,
              imgCedula: cliente.imgCedula,
              certTrabajo: cliente.certTrabajo,
              certCapacitacion: cliente.certCapacitacion,
              curso: resp.nombre,
            });
            this.dtTrigger.next(null);
          });
        });
      });
    });
  }

  cargarTodo() {
    this.clientes = [];
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    this.firestoreSvc.getDocs('Ventas').subscribe((resp: any) => {
      let ventas: any[] = [];
      this.ciudades.forEach((ciudad: any) => {
        const venta = resp.filter((venta: any) => venta.idCiudad === ciudad.id);
        ventas = [...ventas, ...venta];
      });
      console.log(ventas);
      
      this.firestoreSvc.getDocs('Clientes').subscribe((resp: any) => {
        const clientes = resp.filter((cliente: any) => ventas.find((venta: any) => venta.idCliente === cliente.id));
        clientes.forEach((cliente: any) => {
          const venta = ventas.find((venta: any) => venta.idCliente === cliente.id);
          this.firestoreSvc.getDoc('Cursos', venta.idCurso).subscribe((resp: any) => {
            const ciudad = this.ciudades.find((ciudad: any) => ciudad.id === venta.idCiudad);
            this.clientes.push({
              id: cliente.id,
              cedula: cliente.cedula,
              nombre: cliente.nombre,
              apellido: cliente.apellido,
              email: cliente.email,
              telefono: cliente.telefono,
              direccion: cliente.direccion,
              ciudad: ciudad?.nombre,
              imgCedula: cliente.imgCedula,
              certTrabajo: cliente.certTrabajo,
              certCapacitacion: cliente.certCapacitacion,
              curso: resp.nombre,
            });
            this.dtTrigger.next(null);
          });
        });
      });
    });
  }

  verInfo(idCliente: string) {
    this.modal.open(ModalFormClienteComponent, {
      scrollable: true,
      centered: true,
      size: 'md',
    }).componentInstance.idCliente = idCliente;
  }

  camposFaltantes(cliente: any) {
    if (!cliente.imgCedula || !cliente.certTrabajo || !cliente.certCapacitacion) {
      return true
    }
    return false;
  }

  private ordenarAlfabeticamente(a: any, b: any) {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }
}
