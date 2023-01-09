import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { AuthService } from '../../../services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalInfoComponent } from '../../../components/modal-info/modal-info.component';
import { FirestoreService } from '../../../services/firestore.service';
import { validarPasswdIguales } from 'src/app/validators/validators';

export interface Info {
  tipo: string;
  icono: string;
  titulo: string;
  mensaje: string;
  id?: string;
  col?: string;
}

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  registroForm: FormGroup = this.fBuilder.group({
    correo: ['', [Validators.required, Validators.email]],
    passwd: ['', [Validators.required, Validators.minLength(8)]],
    passwd2: ['', [Validators.required, Validators.minLength(8)]],
    cedula: ['', []],
    nombre: [''],
    apellido: [''],
    telefono: [''],
    ciudad: [''],
  },
    {
      validators: validarPasswdIguales('passwd', 'passwd2')
    });

  usuario: any;
  ciudades: any[];
  cargandoBuscar: boolean = false;
  cargandoGuardar: boolean = false;
  visible: boolean = false;

  constructor(private fBuilder: FormBuilder, private authSvc: AuthService, private firestoreSvc: FirestoreService, private modal: NgbModal) { }

  get errorCorreo() {
    const error = this.registroForm.controls['correo'].errors;
    if (error) {
      return error['required'] ? 'El correo es requerido' : error['email'] ? 'El correo no es válido' : '';
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
      return (error['minlength'] || error['noIguales']) ? 'Las contraseñas no coinciden' : '';
    }
    return '';
  }

  ngOnInit(): void {
    this.firestoreSvc.getDocs('Ciudades').subscribe((resp: any[]) => {
      this.ciudades = resp;
    });
    this.registroForm.controls['passwd'].disable();
    this.registroForm.controls['passwd2'].disable();
    this.registroForm.controls['cedula'].disable();
    this.registroForm.controls['nombre'].disable();
    this.registroForm.controls['apellido'].disable();
    this.registroForm.controls['telefono'].disable();
    this.registroForm.controls['ciudad'].disable();
  }

  validarCampos(campo: string) {
    return this.registroForm.controls[campo].errors && this.registroForm.controls[campo].touched;
  }

  buscarCorreo() {
    if (this.registroForm.controls['correo'].invalid) {
      this.registroForm.controls['correo'].markAsTouched();
      return;
    }
    this.cargandoBuscar = true;
    this.firestoreSvc.getDocs('Usuarios').subscribe((resp: any[]) => {
      const usuario = resp.find(usuario => usuario.email == this.registroForm.controls['correo'].value);
      if (!usuario) {
        console.log('no existe');
        this.cargandoBuscar = false;
        const modalRef = this.modal.open(ModalInfoComponent, { centered: true, scrollable: true, backdrop: 'static', keyboard: false });
        modalRef.componentInstance.info = {
          tipo: 'error',
          icono: 'error',
          titulo: 'Error',
          mensaje: 'No existe un usuario con el correo ingresado'
        };
        return;
      }
      this.usuario = usuario;
      console.log(this.usuario);
      this.registroForm.controls['passwd'].enable();
      this.registroForm.controls['passwd2'].enable();
      const ciudad = this.ciudades.find(ciudad => ciudad.id == usuario.idCiudad);
      this.registroForm.setValue({
        correo: this.registroForm.controls['correo'].value,
        passwd: '',
        passwd2: '',
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        telefono: usuario.telefono,
        ciudad: ciudad ? ciudad.nombre : ''
      });
      this.cargandoBuscar = false;
      this.cargandoBuscar = false;
    })
  }

  guardar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    const credenciales = {
      email: this.registroForm.controls['correo'].value,
      passwd: this.registroForm.controls['passwd'].value
    }

    this.cargandoGuardar = true;
    console.log(credenciales);

    this.authSvc.registro(credenciales).then((resp: any) => {
      if (resp.code) {
        const modalRef = this.modal.open(ModalInfoComponent, { centered: true, scrollable: true, backdrop: 'static', keyboard: false });
        let mensaje = '';
        switch (resp.code) {
          case 'auth/email-already-in-use':
            mensaje = 'El correo ya se encuentra registrado';
            break;
          case 'auth/invalid-email':
            mensaje = 'El correo no es válido';
            break;
          case 'auth/operation-not-allowed':
            mensaje = 'El registro de usuarios está deshabilitado';
            break;
          default:
            mensaje = 'Error desconocido.\n' + 'Por favor, intente más tarde o comuníquese con el administrador.';
            break;
        }
        modalRef.componentInstance.info = {
          tipo: 'error',
          icono: 'error',
          titulo: 'Error',
          mensaje: mensaje
        };
      } else {
        this.firestoreSvc.actualizarDoc('Usuarios', this.usuario.id, { uid: resp.user.uid }).then(() => {
          const modalRef = this.modal.open(ModalInfoComponent, { centered: true, scrollable: true, backdrop: 'static', keyboard: false });
          modalRef.componentInstance.info = {
            tipo: 'exito',
            icono: 'check_circle',
            titulo: 'Éxito al guardar',
            mensaje: 'El usuario se ha registrado correctamente. Se inciará sesión automáticamente'
          };
        });
      }
    }).finally(() => {
      this.cargandoGuardar = false;
    });
  }
}
