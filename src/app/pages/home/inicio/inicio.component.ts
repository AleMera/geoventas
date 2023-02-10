import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {
  menu: any[] = [
    {
      ruta: '/inicio',
      texto: 'Cursos',
      fragment: 'cursos',
    },
    {
      ruta: '/infoCursos',
      texto: 'Información de cursos',
      fragment: 'infoCursos',
    },
    {
      ruta: '/nosotros',
      texto: 'Nosotros',
      fragment: 'nosotros',
    },
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  irASection(id: string) {
    this.router.navigate(['/inicio'], { fragment: id });
  }

}
