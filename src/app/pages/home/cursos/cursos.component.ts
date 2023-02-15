import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {

  @Input('idCategoria') idCategoria: string;
  cursos: any[] = [];
  categoria: string;

  constructor(private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    console.log(this.idCategoria);
    
    if (this.idCategoria) {
      this.firestoreSvc.getDoc('Categorias', this.idCategoria).subscribe((res: any) => {
        this.categoria = res.nombre.toUpperCase();
      });
    }
    this.cargarCursos(this.idCategoria);
  }

  cargarCursos(idCategoria?: string) {
    this.firestoreSvc.getDocs('Cursos').subscribe((res) => {
      this.cursos = res;
      if (idCategoria) {
        this.cursos = this.cursos.filter((curso) => curso.idCategoria.includes(idCategoria));
        console.log(this.cursos);
      }
    });

  }

}
