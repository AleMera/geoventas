import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  cursos: any[] = [];
  cursosMostrar: any[] = [];
  cursosXCategoria: any[];
  idCategoriaSeleccionada: string = '';
  categorias: any[] = [];
  limite: number = 4;
  cargando: boolean = false;
  nombreImg: string = '';

  constructor(private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.firestoreSvc.getDocs('Cursos').subscribe((res) => {
      this.cursos = res;
      this.cargando = false;
    });
    this.firestoreSvc.getDocs('Categorias').subscribe((res: any) => {
      this.categorias = res;
    });
  }


  cambiarPanel(event: any) {
    const idCategoria = this.idCategoriaSeleccionada = event.panelId;
    this.cursosXCategoria = this.cursos.filter((curso) => curso.idCategoria == idCategoria);

  }
}
