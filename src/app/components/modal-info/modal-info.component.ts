import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Info } from 'src/app/pages/auth/registro/registro.component';
import { Router } from '@angular/router';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  @Input() info!: Info;
  cargando: boolean = false;

  constructor(private router: Router, protected modal: NgbModal, private firestoreSvc: FirestoreService, private storageSvc: StorageService) { }

  ngOnInit(): void {
    console.log(this.info);
  }

  aceptar() {
    if (this.info.id && this.info.col) {
      const idDoc: string = this.info.id;
      this.cargando = true;
      this.firestoreSvc.eliminarDoc(this.info.col, this.info.id).then(()=>{
        if (this.info.col === 'Cursos') {
          this.storageSvc.eliminarImgsDoc(this.info.col, idDoc);
        }
        this.modal.dismissAll();
      }).
      catch(()=>{
        this.modal.dismissAll();
        this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = {
          tipo: 'error',
          icono: 'error',
          titulo: 'Error al eliminar.',
          mensaje: 'Ha ocurrido un error al eliminar el registro.',
        };
      })
      .finally(()=>{
        this.cargando = false;
        this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = {
          tipo: 'exito',
          icono: 'check_circle',
          titulo: 'Registro eliminado.',
          mensaje: 'El registro se ha eliminado correctamente.',
        };
      });
      return;
    }
    if (this.info.tipo === 'error') {
      this.modal.dismissAll();

      return;
    } else {
      this.router.navigate(['/principal'])
        .finally(() => {
          this.modal.dismissAll();
        });
    }
  }
}
