import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Cliente } from 'src/app/app.interfaces';
import { Info } from 'src/app/app.interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { ModalInfoComponent } from '../modal-info/modal-info.component';

interface Alert {
  type: string;
  msj: string;
}

@Component({
  selector: 'app-modal-form-cliente',
  templateUrl: './modal-form-cliente.component.html',
  styleUrls: ['./modal-form-cliente.component.scss']
})


export class ModalFormClienteComponent implements OnInit {

  @Input() cliente!: any;
  cargando: boolean = false;
  finalizado: boolean = false;
  alert!: Alert;

  clienteForm: FormGroup = this.fBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', Validators.required],
    telefono: ['', Validators.required],
    direccion: ['', Validators.required],
    ciudades: [[], Validators.required],
    cursos: [[], Validators.required],

  });

  ciudades = ['Ambato', 'Cuenca', 'Guayaquil', 'Loja', 'Quito', 'Riobamba', 'Tulcán'];
  cursos = ['Programación', 'Diseño', 'Marketing', 'Finanzas', 'Administración', 'Otros'];

  constructor(protected modal: NgbModal, private fBuilder: FormBuilder, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    console.log(this.cliente);
    (this.cliente) ? this.cargarDatos() : null;
  }

  cargarDatos() {
    this.clienteForm.setValue({
      nombre: this.cliente.nombre,
      apellido: this.cliente.apellido,
      email: this.cliente.email,
      telefono: '1234567890',
      direccion: 'Calle 123',
      ciudades: 'Ambato',
      cursos: 'Programación'
    });
  }

  validarCampos(campo: string) {
    return this.clienteForm.controls[campo].errors && this.clienteForm.controls[campo].touched;
  }

  asignarValores() {
    this.cliente = {
      id: this.cliente.id,
      nombre: this.clienteForm.value.nombre,
      apellido: this.clienteForm.value.apellido,
      email: this.clienteForm.value.email,
      telefono: this.clienteForm.value.telefono,
      direccion: this.clienteForm.value.direccion,
      ciudades: this.clienteForm.value.ciudades,
      cursos: this.clienteForm.value.cursos,
    }
  }

  guardar() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    if (this.cliente) {
      console.log(this.cliente.id);
      
      // Actualizar
      if (!this.clienteForm.dirty) {
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
    } else {
      // Crear
      this.asignarValores();
      this.cargando = true;
      this.firestoreSvc.crearDocumento('Clientes', this.cliente).then(() => {
        const info: Info = {
          tipo: 'exito',
          icono: 'success',
          titulo: 'Cliente creado',
          mensaje: 'El cliente se ha creado correctamente',
        }
        this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
      }).catch((error) => {
        const info: Info = {
          tipo: 'error',
          icono: 'error',
          titulo: 'Error al crear',
          mensaje: 'No se ha podido crear el cliente',
        }
        this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
      }).finally(() => {
        this.cargando = false;
        this.finalizado = true;
      });
    }
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
    this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
  }

  onChangeCurso(event: any) {
    console.log(event);
  }
  onChangeCiudad(event: any) {
    console.log(event);
  }
}
