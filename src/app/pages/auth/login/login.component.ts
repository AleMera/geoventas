import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalErrorComponent } from '../../../components/modal-error/modal-error.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  @ViewChild('passwdInput') passwdInput!: ElementRef;
  loginForm: FormGroup = this.fbuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    passwd: ['', Validators.required,],
  });

  passwdIncorrecta: boolean = false;
  cargando: boolean = false;

  constructor(private authSvc: AuthService, private fbuilder: FormBuilder, private router: Router, private modal: NgbModal) { }

  get errorCorreo() {
    const error = this.loginForm.controls['correo'].errors;
    if (error) {
      return error['required'] ? 'El correo es requerido' : error['email'] ? 'El correo no es válido' : '';
    }
    return '';
  }

  get errorPasswd() {
    const error = this.loginForm.controls['passwd'].errors;
    if (error) {
      return error['required'] ? 'La contraseña es requerida' : '';
    }
    return '';
  }

  ngOnInit(): void {

  }


  validarCampos(campo: string) {
    return this.loginForm.controls[campo].errors && this.loginForm.controls[campo].touched;
  }

  asignarValores() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const correo = this.loginForm.value.correo;
    const passwd = this.loginForm.value.passwd;
    return { correo, passwd }
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const credenciales = this.asignarValores();
    this.cargando = true;
    this.authSvc.login(credenciales?.correo, credenciales?.passwd).then((res: any) => {
      if (res.code) {
        let code: string = res.code;
        let msj: string;
        switch (code) {
          case 'auth/user-not-found':
            msj = 'El usuario no existe';
            this.abrirModal({ msj, code });
            break;
          case 'auth/wrong-password':
            this.passwdIncorrecta = true;
            break;
          default:
            msj = 'Error desconocido';
            this.abrirModal({ msj, code });
            break;
        }
      }
      this.cargando = false;
      this.router.navigate(['/principal'])

    });
  }

  abrirModal(error: any) {
    this.modal.open(ModalErrorComponent, { centered: true, size: 'lg' })
      .componentInstance.error = error;
  }
}
