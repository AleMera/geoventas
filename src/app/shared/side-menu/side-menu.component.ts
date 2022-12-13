import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss']
})
export class SideMenuComponent implements OnInit {

  menu: any[] = []
  constructor() { }

  ngOnInit(): void {
    this.menu = [
      {
        ruta: '/principal/mapa',
        texto: 'Mapa',
        icono: 'map'
      },
      {
        ruta: '/principal/dashboard',
        texto: 'Dashboard',
        icono: 'dashboard'
      },
      {
        ruta: '/principal/usuarios',
        texto: 'Usuarios',
        icono: 'people'
      },
      {
        ruta: '/principal/cursos',
        texto: 'Cursos',
        icono: 'book'
      }
    ]
  }

}
