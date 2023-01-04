import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { Curso } from '../../app.interfaces';
import { ModalFormClienteComponent } from '../modal-form-cliente/modal-form-cliente.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFormCursoComponent } from '../modal-form-curso/modal-form-curso.component';
import { ModalFormUsuarioComponent } from '../modal-form-usuario/modal-form-usuario.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy {

  @Input() coleccion!: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  data: any[] = [];
  titulos: string[] = [];

  constructor(private firestoreSvc: FirestoreService, private modal: NgbModal) { }

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
      scrollY: '400px',
    };
  }

  getData() {
    this.firestoreSvc.getDocs<any>(this.coleccion).subscribe((resp) => {
      console.log(resp);
      this.data = [];
      switch (this.coleccion) {
        case 'Cursos':
          this.titulos = ['nombre', 'precio', 'modalidad', 'duracion', 'horario'];
          resp.forEach((curso: any) => {
            this.data.push({
              id: curso.id,
              nombre: curso.nombre,
              precio: curso.precio,
              modalidad: curso.modalidad,
              duracion: curso.duracion,
              horario: curso.horario,
              certif: curso.certif,
              fecha: curso.fecha,
              imgsUrl: '',
            });
          });

          break;
        case 'Usuarios':
          this.titulos = ['nombre', 'apellido', 'email', 'telefono', 'ciudades'];
          resp.forEach((usuario: any) => {
            this.data.push({
              id: usuario.id,
              cedula: usuario.cedula,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              email: usuario.email,
              telefono: usuario.telefono,
              ciudades: usuario.ciudades,
              passwd: ''
            });
          });
          break;
        case 'Clientes':
          this.titulos = ['nombre', 'apellido', 'email', 'telefono', 'ciudad'];
          resp.forEach((cliente: any) => {
            this.data.push({
              id: cliente.id,
              nombre: cliente.nombre,
              apellido: cliente.apellido,
              email: cliente.email,
              telefono: cliente.telefono,
              ciudades: cliente.ciudades
            });
          });
          break;
        default:
          break;
      }
      this.dtTrigger.next(null);
    });
  }

  nuevo() {
    switch (this.coleccion) {
      case 'Cursos':
        this.modal.open(ModalFormCursoComponent, {
          scrollable: true,
          centered: true,
        });
        break;
      case 'Usuarios':
        this.modal.open(ModalFormUsuarioComponent, {
          scrollable: true,
          centered: true,
        });
        break;
      case 'Clientes':
        this.modal.open(ModalFormClienteComponent, {
          scrollable: true,
          centered: true,
        });
        break;
      default:
        break;
    }
  }

  verInfo(item: any) {
    console.log(item);
    switch (this.coleccion) {
      case 'Cursos':
        this.modal.open(ModalFormCursoComponent, {
          scrollable: true,
          centered: true,
        }).componentInstance.curso = item;
        break;
      case 'Usuarios':
        this.modal.open(ModalFormUsuarioComponent, {
          scrollable: true,
          centered: true,
        }).componentInstance.usuario = item;
        break;
      case 'Clientes':
        this.modal.open(ModalFormClienteComponent, {
          scrollable: true,
          centered: true,
        }).componentInstance.cliente = item;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
