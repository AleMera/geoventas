import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbAlert } from '@ng-bootstrap/ng-bootstrap';

import { Cliente } from 'src/app/app.interfaces';
import { FirestoreService } from '../../services/firestore.service';

interface Alert {
  type: string;
  msj: string;
}

@Component({
  selector: 'app-modal-form-user',
  templateUrl: './modal-form-user.component.html',
  styleUrls: ['./modal-form-user.component.scss']
})


export class ModalFormUserComponent implements OnInit {

  @Input() cliente!: Cliente;
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

  guardar() {
    console.log(this.clienteForm.controls['ciudades']);
    
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const cliente: any = {
      nombre: this.clienteForm.value.nombre,
      apellido: this.clienteForm.value.apellido,
      email: this.clienteForm.value.email,
      telefono: this.clienteForm.value.telefono,
      direccion: this.clienteForm.value.direccion,
      ciudades: this.clienteForm.value.ciudades,
      cursos: this.clienteForm.value.cursos,
    }

    if (this.cliente) {
      // Actualizar
    } else {
      // Crear
      this.cargando = true;
      this.firestoreSvc.crearDocumento('Clientes', cliente)
        .then(() => {
          this.alert = {
            type: 'success',
            msj: 'El cliente se ha creado exitosamente'
          }
          console.log('Documento creado exitosamente');
        })
        .catch((error) => {
          this.alert = {
            type: 'danger',
            msj: 'No se ha podido crear el cliente'
          }
          console.log('Error creando el documento', error);
        })
        .finally(() => {
          this.cargando = false;
          this.finalizado = true;
        });
    }
  }

  onChangeCurso(event: any) {
    console.log(event);
  }
  onChangeCiudad(event: any) {
    console.log(event);
  }

  cerrar() {
    this.finalizado = false;
  }
}
