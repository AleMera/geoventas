import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { AuthService } from '../../services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { Info } from 'src/app/app.interfaces';

@Component({
  selector: 'app-modal-form-usuario',
  templateUrl: './modal-form-usuario.component.html',
  styleUrls: ['./modal-form-usuario.component.scss']
})
export class ModalFormUsuarioComponent implements OnInit {

  @Input() usuario!: any;
  cargando: boolean = false;

  usuarioForm: FormGroup = this.fBuilder.group({
    cedula: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    ciudades: [[], Validators.required],
    passwd: ['', [Validators.required, Validators.minLength(8)]],
  });
  
  ciudades = ['Ambato', 'Cuenca', 'Guayaquil', 'Loja', 'Quito', 'Riobamba', 'Tulcán'];

  constructor(protected modal: NgbModal, private fBuilder: FormBuilder, private authSvc: AuthService, private firestoreSvc: FirestoreService) { }

  get errorCedula() {
    const error = this.usuarioForm.controls['cedula'].errors;
    if (error) {
      return error['required'] ? 'La cédula es requerida' : (error['minlength'] || error['maxlength']) ? 'La cédula debe tener 10 dígitos' : '';
    }
    return '';
  }

  get errorNombre() {
    const error = this.usuarioForm.controls['nombre'].errors;
    if (error) {
      return error['required'] ? 'El nombre es requerido' : '';
    }
    return '';
  }

  get errorApellido() {
    const error = this.usuarioForm.controls['apellido'].errors;
    if (error) {
      return error['required'] ? 'El apellido es requerido' : '';
    }
    return '';
  }

  get errorEmail() {
    const error = this.usuarioForm.controls['email'].errors;
    if (error) {
      return error['required'] ? 'El correo es requerido' : error['email'] ? 'El correo no es válido' : '';
    }
    return '';
  }

  get errorTelf() {
    const error = this.usuarioForm.controls['telefono'].errors;
    if (error) {
      return error['required'] ? 'El teléfono es requerido' : (error['minlength'] || error['maxlength']) ? 'El teléfono debe tener 10 dígitos' : '';
    }
    return '';
  }

  get errorCiudad() {
    const error = this.usuarioForm.controls['ciudades'].errors;
    if (error) {
      return error['required'] ? 'La ciudad es requerida' : '';
    }
    return '';
  }

  get errorPasswd() {
    const error = this.usuarioForm.controls['passwd'].errors;
    if (error) {
      return error['required'] ? 'La contraseña es requerida' : error['minlength'] ? 'La contraseña debe tener al menos 8 caracteres' : '';
    }
    return '';
  }


  ngOnInit(): void {
    console.log(this.usuario);
    this.usuario ? this.cargarDatos() : null;
  }

  cargarDatos() {
    this.usuarioForm.setValue({
      cedula: this.usuario.cedula,
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      email: this.usuario.email,
      telefono: this.usuario.telefono,
      ciudades: this.usuario.ciudades,
      passwd: this.usuario.passwd
    });
  }

  validarCampos(campo: string) {
    return this.usuarioForm.controls[campo].errors && this.usuarioForm.controls[campo].touched;
  }
  
  asignarValores() {
    this.usuario = {
      id: this.firestoreSvc.crearIdDoc(),
      cedula: this.usuarioForm.controls['cedula'].value,
      nombre: this.usuarioForm.controls['nombre'].value,
      apellido: this.usuarioForm.controls['apellido'].value,
      email: this.usuarioForm.controls['email'].value,
      telefono: this.usuarioForm.controls['telefono'].value,
      ciudades: this.usuarioForm.controls['ciudades'].value,
      passwd: this.usuarioForm.controls['passwd'].value,
    }
  }

  guardar() {
    if (this.usuarioForm.invalid) {
      this.usuarioForm.markAllAsTouched();
      return;
    }
    this.cargando = true;
    this.asignarValores();
    this.firestoreSvc.crearDocumento('Usuarios', this.usuario).then(() => {
    this.authSvc.registro(this.usuario).then(() => {
      const info: Info = {
        tipo: 'exito',
        icono: 'check_circle',
        titulo: 'Usuario registrado',
        mensaje: 'El usuario se registró correctamente',
      }
      this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
    }).catch((err) => {
      const info: Info = {
        tipo: 'error',
        icono: 'error',
        titulo: 'Error al registrar',
        mensaje: err.message,
      }
      this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;

    }).finally(() => {
      this.cargando = false;
    });
  });
  }

  eliminar() {
    this.cargando = true;
    const info: Info = {
      tipo: 'Eliminar',
      icono: 'warning',
      titulo: 'Eliminar Usuario',
      mensaje: '¿Está seguro que desea eliminar este usuario? \n Esta acción no se puede deshacer.',
      id: this.usuario.id,
      col: 'Usuarios'
    }
    this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
  }
}
