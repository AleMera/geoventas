import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Info } from 'src/app/app.interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { Ciudad } from '../../app.interfaces';
import { validarCedula } from '../../validators/validators';


@Component({
  selector: 'app-modal-form-cliente',
  templateUrl: './modal-form-cliente.component.html',
  styleUrls: ['./modal-form-cliente.component.scss']
})


export class ModalFormClienteComponent implements OnInit {

  @Input() idCliente!: any;

  cliente!: any;
  cargando: boolean = false;
  finalizado: boolean = false;
  cursos: any[] = [];
  ciudades: Ciudad[] = [];

  clienteForm: FormGroup = this.fBuilder.group({
    cedula: ['', [Validators.required, validarCedula]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    direccion: ['', Validators.required],
    ciudad: [[], Validators.required],

  });


  constructor(protected modal: NgbModal, private fBuilder: FormBuilder, private firestoreSvc: FirestoreService) { }

  get errorCedula() {
    const error = this.clienteForm.controls['cedula'].errors;
    if (error) {
      return error['required'] ? 'La cédula es obligatoria' : (error['cedulaIncompleta'] || error['cedulaInvalida']) ? 'La cédula no es válida' : '';
    }
    return '';
  }

  get errorNombre() {
    const error = this.clienteForm.controls['nombre'].errors;
    if (error) {
      return error['required'] ? 'El nombre es obligatorio' : '';
    }
    return '';
  }

  get errorApellido() {
    const error = this.clienteForm.controls['apellido'].errors;
    if (error) {
      return error['required'] ? 'El apellido es obligatorio' : '';
    }
    return '';
  }

  get errorEmail() {
    const error = this.clienteForm.controls['email'].errors;
    if (error) {
      return error['required'] ? 'El email es obligatorio' : error['email'] ? 'El email no es válido' : '';
    }
    return '';
  }

  get errorTelefono() {
    const error = this.clienteForm.controls['telefono'].errors;
    if (error) {
      return error['required'] ? 'El teléfono es obligatorio' : (error['minlength'] || error['maxlength']) ? 'El teléfono debe tener 10 dígitos' : '';
    }
    return '';
  }

  get errorDireccion() {
    const error = this.clienteForm.controls['direccion'].errors;
    if (error) {
      return error['required'] ? 'La dirección es obligatoria' : '';
    }
    return '';
  }

  get errorCiudad() {
    const error = this.clienteForm.controls['ciudad'].errors;
    if (error) {
      return error['required'] ? 'La ciudad es obligatoria' : '';
    }
    return '';
  }

  ngOnInit(): void {
    this.firestoreSvc.getDocs<Ciudad>('Ciudades').subscribe((resp) => {
      this.ciudades = resp;
    });
    this.firestoreSvc.getDocs('Cursos').subscribe((resp) => {
      this.cursos = resp;
      (this.idCliente) ? this.cargarCliente() : null;
    });
  }

  cargarCliente() {
    this.cargando = true;
    this.firestoreSvc.getDoc('Clientes', this.idCliente).subscribe((cliente: any) => {
      this.cliente = cliente;
      let ciudadNombre = this.ciudades.find((ciudad) => ciudad.id === this.cliente.idCiudad)?.nombre;
      this.clienteForm.setValue({
        cedula: this.cliente.cedula,
        nombre: this.cliente.nombre,
        apellido: this.cliente.apellido,
        email: this.cliente.email,
        telefono: this.cliente.telefono,
        direccion: this.cliente.direccion,
        ciudad: ciudadNombre ? ciudadNombre : '',
      });
      this.cargando = false;
    });
  }

  asignarValores() {
    this.ciudades.map((ciudad) => {
      if (ciudad.nombre === this.clienteForm.controls['ciudad'].value) {
        this.cliente.idCiudad = ciudad.id;
      }
    });
    this.cliente = {
      id: this.idCliente,
      cedula: this.clienteForm.controls['cedula'].value,
      nombre: this.clienteForm.controls['nombre'].value,
      apellido: this.clienteForm.controls['apellido'].value,
      email: this.clienteForm.controls['email'].value,
      telefono: this.clienteForm.controls['telefono'].value,
      direccion: this.clienteForm.controls['direccion'].value,
    }
    console.log(this.cliente);
  }

  validarCampos(campo: string) {
    return this.clienteForm.controls[campo].errors && this.clienteForm.controls[campo].touched;
  }

  guardar() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }
    this.asignarValores();
    this.cargando = true;
    this.firestoreSvc.actualizarDoc('Clientes', this.cliente.id, this.cliente).then(() => {
      const info: Info = {
        tipo: 'exito',
        icono: 'check_circle',
        titulo: 'Datos actualizados',
        mensaje: 'Los datos del cliente se han actualizado correctamente',
      }
      this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
    }).catch((error) => {
      const info: Info = {
        tipo: 'error',
        icono: 'error',
        titulo: 'Error al actualizar',
        mensaje: 'No se han podido actualizar los datos del cliente',
      }
      this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
    }).finally(() => {
      this.cargando = false;
      this.finalizado = true;
    });
  }

  eliminar() {
    this.cargando = true;
    const info: Info = {
      tipo: 'Eliminar',
      icono: 'warning',
      titulo: 'Eliminar Cliente',
      mensaje: '¿Está seguro que desea eliminar este cliente? \n Esta acción no se puede deshacer.',
      id: this.cliente.id,
      col: 'Clientes'
    }
    this.modal.open(ModalInfoComponent, { centered: true, scrollable: true }).componentInstance.info = info;
  }

  onChangeCurso(event: any) {
  }
  onChangeCiudad(event: any) {
  }
}
