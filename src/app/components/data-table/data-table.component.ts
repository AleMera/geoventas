import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { Curso } from '../../app.interfaces';
import { ModalFormClienteComponent } from '../modal-form-cliente/modal-form-cliente.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    this.coleccion = 'Cursos';
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
    };
  }

  getData() {
    this.firestoreSvc.getDocs<Curso>(this.coleccion).subscribe((resp) => {
      switch (this.coleccion) {
        case 'Cursos':
          this.titulos = ['nombre', 'precio', 'modalidad', 'duracion', 'horario'];
          resp.forEach((curso: Curso) => {
            this.data.push({
              id: curso.id,
              nombre: curso.nombre,
              precio: curso.precio,
              modalidad: curso.modalidad,
              duracion: curso.duracion,
              horario: curso.horario
            });
          });
          
          break;
        case 'Usuarios':
          this.titulos = ['nombre', 'apellido', 'email', 'telefono', 'ciudad'];
          resp.forEach((usuario: any) => {
            this.data.push({
              id: usuario.id,
              nombre: usuario.nombre,
              apellido: usuario.apellido,
              email: usuario.email,
              telefono: usuario.telefono,
              ciudad: usuario.ciudad
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
              ciudad: cliente.ciudad
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
  }

  verInfo(item: any) {
    console.log('Editar: ' + item);
    this.modal.open(ModalFormClienteComponent, {
      scrollable: true,
      centered: true,
    }).componentInstance.cliente = item;
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
