import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  logueado: boolean;
  usuario: any = {
    nombre: '',
    email: '',
    uid: '',
    
  };
  cargando: boolean;
  constructor(private router: Router, private authSvc: AuthService) {
    this.logueado = false;
    this.cargando = false;
  }

  ngOnInit(): void {
    this.usuarioLogueado();
  }

  usuarioLogueado() {
    this.cargando = true;
    return this.authSvc.getUserInfo().subscribe(user => {
      if (user) {
        this.logueado = true;
        this.usuario = user;
      }
      this.cargando = false;
    });
  }

  irALogin(){
    this.router.navigate(['/auth/login']);
  }

  irAlRegistro() {
    this.router.navigate(['/auth/registro']);
  }

  irAInicio() {
    this.router.navigate(['/']);
  }

  irAMain() {
    this.router.navigate(['/principal/mapa']);
  }

  adminMenu() {
    this.router.navigate(['/admin/usuarios']);
  }

  cerrarSesion() {
    this.authSvc.logout().then(() => {

    this.logueado = false;
    this.usuario = null;
    })
    .finally(() => {
    this.router.navigate(['/']);
    });
  }

}
