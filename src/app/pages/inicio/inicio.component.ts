import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFormCursoComponent } from '../../components/modal-form-curso/modal-form-curso.component';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit, OnDestroy {

  cursos: any[] = [];
  cursosMostrar: any[] = [];
  limite: number = 4;
  cargando: boolean = false;

  constructor(private modal: NgbModal, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.firestoreSvc.getDocs('Cursos').subscribe((res) => {
      this.cursos = res;
      console.log(res);
      if (this.cursos.length > 3) {
        this.cargarMas();
        return;
      }
      this.cursosMostrar = this.cursos
      this.cargando = false;  
    })
  }

  /**
   * Método que carga los cursos aumentando de 3 en 3
   */
  cargarMas() {
    setTimeout(() => {
      this.cargando = false;
      this.cursosMostrar.push(...this.cursos.splice(0, this.limite));
    }, 1000);
    this.cargando = true;
  }

  agregarCurso() {
    this.modal.open(ModalFormCursoComponent, {
      scrollable: true,
      size: 'lg',
      centered: true
    })
  }

  ngOnDestroy(): void {
    this.cursos = [];
    this.cursosMostrar = [];
    this.cargando = false;
  }
}
