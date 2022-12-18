import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFormCursoComponent } from '../../components/modal-form-curso/modal-form-curso.component';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  cursos: any[] = [];
  cursosMostrar: any[] = [];
  limite: number = 4;
  cargando: boolean = false;

  constructor(private modal: NgbModal, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.cargando = !this.cargando;
    this.firestoreSvc.getDocs('Cursos').subscribe((res) => {
      console.log(res);
      this.cursos = res;
      this.cargarMas();
      this.cargando = !this.cargando;
    });
  }

  /**
   * Método que carga los cursos aumentando de 3 en 3
   */
  cargarMas() {
    setTimeout(() => {
      this.cargando = !this.cargando;
      this.cursosMostrar.push(...this.cursos.splice(0, this.limite));
    }, 1000);
    this.cargando = !this.cargando;
  }

  agregarCurso() {
    this.modal.open(ModalFormCursoComponent, {
      scrollable: true,
      size: 'lg',
      centered: true
    })

  }
}
