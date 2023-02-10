import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-cursos-categorias',
  templateUrl: './cursos-categorias.component.html',
  styleUrls: ['./cursos-categorias.component.scss']
})
export class CursosCategoriasComponent implements OnInit {

  cursos: any[] = [];
  categorias: any[] = [];
  idCategoriaSeleccionada: string = '';
  cursosXCategoria: any[] = [];

  constructor(private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreSvc.getDocs('Cursos').subscribe((res) => {
      this.cursos = res;
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
