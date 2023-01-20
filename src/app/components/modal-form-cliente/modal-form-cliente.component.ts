import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Info } from 'src/app/app.interfaces';
import { FirestoreService } from '../../services/firestore.service';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { Ciudad } from '../../app.interfaces';
import { validarCedula } from '../../validators/validators';
import { StorageService } from '../../services/storage.service';


@Component({
  selector: 'app-modal-form-cliente',
  templateUrl: './modal-form-cliente.component.html',
  styleUrls: ['./modal-form-cliente.component.scss']
})


export class ModalFormClienteComponent implements OnInit {

  @Input() idCliente!: any;
  @Input() idCurso!: any;

  cliente!: any;
  curso!: any;
  venta!: any;

  cargando: boolean = false;

  cursos: any[] = [];
  ciudades: Ciudad[] = [];
  pdfCedula: string;
  pdfCertTrabajo: string;
  pdfCertCapacitacion: string;

  cedulaFisica: File;
  certTrabajo: File;
  certCapacitacion: File;

  clienteForm: FormGroup = this.fBuilder.group({
    // cedula: ['', [Validators.required, validarCedula]],
    cedula: ['', [Validators.required]],
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    direccion: ['', Validators.required],
    ciudad: [[], Validators.required],
    imgCedula: [null],
    certTrabajo: [null],
    certCapacitacion: [null],
  });


  constructor(protected modal: NgbModal, private fBuilder: FormBuilder, private firestoreSvc: FirestoreService, private storageSvc: StorageService) { }

  // get errorCedula() {
  //   const error = this.clienteForm.controls['cedula'].errors;
  //   if (error) {
  //     return error['required'] ? 'La cédula es obligatoria' : (error['cedulaIncompleta'] || error['cedulaInvalida']) ? 'La cédula no es válida' : '';
  //   }
  //   return '';
  // }
  get errorCedula() {
    const error = this.clienteForm.controls['cedula'].errors;
    if (error) {
      return error['required'] ? 'La cédula es obligatoria' : '';
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

  get errorImgCedula() {
    const error = this.clienteForm.controls['imgCedula'].errors;
    if (error) {
      return error['required'] ? 'La imagen de la cédula es obligatoria' : '';
    }
    return '';
  }

  get errorCertTrabajo() {
    const error = this.clienteForm.controls['certTrabajo'].errors;
    if (error) {
      return error['required'] ? 'El certificado de trabajo es obligatorio' : '';
    }
    return '';
  }

  get errorCertCapacitacion() {
    const error = this.clienteForm.controls['certCapacitacion'].errors;
    if (error) {
      return error['required'] ? 'El certificado de capacitación es obligatorio' : '';
    }
    return '';
  }

  ngOnInit(): void {
    this.firestoreSvc.getDocs<Ciudad>('Ciudades').subscribe((resp) => {
      this.ciudades = resp;
      this.ciudades.sort(this.ordenarAlfabeticamente);
    });
    this.firestoreSvc.getDocs('Cursos').subscribe((resp) => {
      (this.idCliente) ? this.cargarCliente() : null;
      if (this.idCurso) {
        this.curso = resp.find((curso: any) => curso.id === this.idCurso);
      } else {
        this.cursos = resp;
      }
      this.cargando = false;
    });
  }

  private ordenarAlfabeticamente(a: any, b: any) {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  }

  private cargarCliente() {
    this.clienteForm.controls['imgCedula'].setValidators([Validators.required]);
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
        imgCedula: '',
        certTrabajo: '',
        certCapacitacion: ''
      });
      this.pdfCedula = this.cliente.imgCedula;
      this.pdfCertTrabajo = this.cliente.certTrabajo;
      this.pdfCertCapacitacion = this.cliente.certCapacitacion;

      this.cargando = false;
    });
  }

  asignarValores() {
    let idCliente;
    let idCiudad;
    let imgCedula;
    let certTrabajo;
    let certCapacitacion;
    this.ciudades.map((ciudad) => {
      if (ciudad.nombre === this.clienteForm.controls['ciudad'].value) {
        idCiudad = ciudad.id;
      }
    });
    if (this.idCliente) {
      idCliente = this.idCliente;
      imgCedula = '';
      certTrabajo = '';
      certCapacitacion = '';
    } else {
      //Campos del cliente
      idCliente = this.firestoreSvc.crearIdDoc();
      imgCedula = '';
      certTrabajo = '';
      certCapacitacion = '';

      //Campos de la venta
      this.venta = {
        id: this.firestoreSvc.crearIdDoc(),
        idCliente: idCliente,
        idCurso: this.idCurso,
        idCiudad: idCiudad,
        fecha: new Date(),
        precio: this.curso.precio,
      }

    }
    this.cliente = {
      id: idCliente,
      idCiudad: idCiudad,
      cedula: this.clienteForm.controls['cedula'].value,
      nombre: this.clienteForm.controls['nombre'].value,
      apellido: this.clienteForm.controls['apellido'].value,
      email: this.clienteForm.controls['email'].value,
      telefono: this.clienteForm.controls['telefono'].value,
      direccion: this.clienteForm.controls['direccion'].value,
      imgCedula: imgCedula,
      certTrabajo: certTrabajo,
      certCapacitacion: certCapacitacion,
    }
  }

  protected validarCampos(campo: string) {
    return this.clienteForm.controls[campo].errors && this.clienteForm.controls[campo].touched;
  }

  guardar() {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }
    this.asignarValores();
    if (this.idCliente) {
      console.log('actualizar');
      this.guardarCambios();
    } else {
      console.log('guardar inscripcion');
      this.guardarInscripcion();
    }
  }

  private guardarCambios() {
    let data = [
      {
        img: this.cedulaFisica,
        nombre: 'Cédula Fisica',
        campo: 'imgCedula',
        finalizado: false
      },
      {
        img: this.certTrabajo,
        nombre: 'Certificado de Trabajo',
        campo: 'certTrabajo',
        finalizado: false
      },
      {
        img: this.certCapacitacion,
        nombre: 'Certificado de Capacitación',
        campo: 'certCapacitacion',
        finalizado: false
      }
    ];
    this.cargando = true;
    data.forEach((item, i) => {
      if (item.img) {
        console.log(`Guardando: ${item.nombre}`);
        this.guardarImg(item.img, item.nombre).then((url) => {
          this.firestoreSvc.actualizarDoc('Clientes', this.cliente.id, { [item.campo]: url }).then(() => {
            item.finalizado = true;
            console.log(`Finalizado: ${item.finalizado}`);
            if ((data.every((item) => item.finalizado)) || ((data[0].finalizado) && (data[1].finalizado || data[2].finalizado)) || (data[0].finalizado)) {
              const info: Info = {
                tipo: 'exito',
                icono: 'check_circle',
                titulo: 'Datos actualizados',
                mensaje: 'Los datos del cliente se han actualizado correctamente',
              }
              this.modal.open(ModalInfoComponent, { centered: true, size: 'sm', backdrop: 'static', keyboard: false }).componentInstance.info = info;
            }
            this.cargando = false;
          })
        });
      }
    });
  }

  private guardarInscripcion() {
    this.cargando = true;
    this.firestoreSvc.crearDocumentoConId('Clientes', this.cliente.id, this.cliente).then(() => {
      this.firestoreSvc.crearDocumentoConId('Ventas', this.venta.id, this.venta).then(() => {
        const info: Info = {
          tipo: 'exito',
          icono: 'check_circle',
          titulo: 'Inscripción realizada',
          mensaje: 'La inscripción se ha realizado correctamente',
        }
        this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
      }).catch((error) => {
        const info: Info = {
          tipo: 'error',
          icono: 'error',
          titulo: 'Error al guardar',
          mensaje: 'No se ha podido guardar la inscripción',
        }
        this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
      }).finally(() => {
        this.cargando = false;
      });
    });
  }

  guardarImg(img: File, nombre: string) {
    return this.storageSvc.subirImg('Clientes', this.cliente.id, nombre, img).then((url) => {
      return url
    })

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
}
