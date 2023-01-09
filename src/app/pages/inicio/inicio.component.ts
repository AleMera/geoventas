import { Component, OnInit } from '@angular/core';
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

  constructor(private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.cargando = true;
    this.firestoreSvc.getDocs('Cursos').subscribe((res) => {
      this.cursos = res;
      this.cargando = false;
    });
  }
}
