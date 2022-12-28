import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { confirmPasswd } from '../../../validators/validators';
import { AuthService } from '../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInfoComponent } from '../../../components/modal-info/modal-info.component';

export interface Info {
  tipo: string;
  icono: string;
  titulo: string;
  mensaje: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  registroForm: FormGroup = this.fBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    tipos: [[], Validators.required],
    passwd: ['', [Validators.required, Validators.minLength(8)]],
    passwd2: ['', [Validators.required, Validators.minLength(8), confirmPasswd]],
  });

  usuario: any;
  tipos: string[] = ['Administrador', 'Cliente'];
  cargando: boolean = false;
  terminado: boolean = false;

  constructor(private fBuilder: FormBuilder, private authSvc: AuthService, private modal: NgbModal) { }

  get errorNombre() {
    const error = this.registroForm.controls['nombre'].errors;
    if (error) {
      return error['required'] ? 'El nombre es requerido' : '';
    }
    return '';
  }

  get errorApellido() {
    const error = this.registroForm.controls['apellido'].errors;
    if (error) {
      return error['required'] ? 'El apellido es requerido' : '';
    }
    return '';
  }

  get errorCorreo() {
    const error = this.registroForm.controls['correo'].errors;
    if (error) {
      return error['required'] ? 'El correo es requerido' : error['email'] ? 'El correo no es válido' : '';
    }
    return '';
  }

  get errorTipos() {
    const error = this.registroForm.controls['tipos'].errors;
    if (error) {
      return error['required'] ? 'El tipo es requerido' : '';
    }
    return '';
  }

  get errorPasswd() {
    const error = this.registroForm.controls['passwd'].errors;
    if (error) {
      return error['required'] ? 'La contraseña es requerida' : error['minlength'] ? 'La contraseña debe tener al menos 8 caracteres' : '';
    }
    return '';
  }

  get errorPasswd2() {
    const error = this.registroForm.controls['passwd2'].errors;
    if (error) {
      return (error['minlength'] || error['confirmPasswd']) ? 'Las contraseñas no coinciden' : '';
    }
    return '';
  }

  ngOnInit(): void {
  }

  validarCampos(campo: string) {
    return this.registroForm.controls[campo].errors && this.registroForm.controls[campo].touched;
  }

  asignarValores() {
    this.usuario = {
      nombre: this.registroForm.controls['nombre'].value,
      apellido: this.registroForm.controls['apellido'].value,
      correo: this.registroForm.controls['correo'].value,
      tipo: this.registroForm.controls['tipos'].value,
      passwd: this.registroForm.controls['passwd'].value,
    }
  }

  guardar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.asignarValores();
    this.authSvc.registro(this.usuario).then((resp: any) => {
      console.log(resp)
      let info: Info = {
        tipo: '',
        icono: '',
        titulo: '',
        mensaje: ''
      };
      if (resp.code) {
        info.tipo = 'error';
        info.icono = 'error';
        info.titulo = 'Error al registrar usuario';
        switch (resp.code) {
          case 'auth/email-already-in-use':
            info.mensaje = 'Ya existe un usuario con el correo ingresado.';
            break;
          case 'auth/operation-not-allowed':
            info.mensaje = 'Operación no permitida';
            break;
          default:
            info.mensaje = 'Error desconocido, por favor intente más tarde o contacte al administrador.';
            break;
        }
      } else {
        info.tipo = 'exito';
        info.icono = 'done';
        info.titulo = 'Registro exitoso';
        info.mensaje = 'Se ha registrado correctamente, se iniciará sesión automáticamente.';
      }
      this.modal.open(ModalInfoComponent, { size: 'md', centered: true, backdrop: 'static' })
        .componentInstance.info = info;
    })
      .finally(() => {
        this.cargando = false;
      });

  }

  onChangeTipo(e: any) {
  }
}
