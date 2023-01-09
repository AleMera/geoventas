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

  iniciarSesion() {
    this.router.navigate(['/auth/login']);
  }

  cerrarSesion() {
    this.authSvc.logout().finally(() => {
      this.logueado = false;
      this.usuario = {
        nombre: '',
        email: '',
        uid: '',
      };
      location.reload();
    });
  }

}
