import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { Info } from 'src/app/app.interfaces';
import { validarFecha } from '../../validators/validators';

@Component({
  selector: 'app-modal-form-curso',
  templateUrl: './modal-form-curso.component.html',
  styleUrls: ['./modal-form-curso.component.scss']
})
export class ModalFormCursoComponent implements OnInit {

  @Input() idCurso!: any;
  curso: any;

  cursoForm: FormGroup = this.fBuilder.group({
    nombre: ['', Validators.required],
    certif: ['', Validators.required],
    duracion: ['', [Validators.required, Validators.min(1)]],
    horario: ['', Validators.required],
    modalidad: ['', Validators.required],
    fecha: ['', [Validators.required, validarFecha]],
    precio: ['', [Validators.required, Validators.min(1)]],
    imgs: [null],
  });

  modalidades = ['Presencial', 'Virtual'];
  cargandoInicio: boolean = false;
  cargandoGuardar: boolean = false;
  cargandoEliminar: boolean = false;
  finalizado: boolean = false;
  imgs: any[] = [];
  imgsStorage: any[] = [];
  editar: boolean = false;

  constructor(protected modal: NgbModal, private fBuilder: FormBuilder, private firestoreSvc: FirestoreService, private storageSc: StorageService) { }

  get errorNombre() {
    const error = this.cursoForm.controls['nombre'].errors;
    if (error) {
      return error['required'] ? 'El nombre es obligatorio' : '';
    }
    return '';
  }

  get errorCertif() {
    const error = this.cursoForm.controls['certif'].errors;
    if (error) {
      return error['required'] ? 'El certificado es obligatorio' : '';
    }
    return '';
  }

  get errorDuracion() {
    const error = this.cursoForm.controls['duracion'].errors;
    if (error) {
      return error['required'] ? 'La duración es obligatoria' : error['min'] ? 'La duración debe ser mayor a 0' : '';
    }
    return '';
  }

  get errorHorario() {
    const error = this.cursoForm.controls['horario'].errors;
    if (error) {
      return error['required'] ? 'El horario es obligatorio' : '';
    }
    return '';
  }

  get errorModalidad() {
    const error = this.cursoForm.controls['modalidad'].errors;
    if (error) {
      return error['required'] ? 'La modalidad es obligatoria' : '';
    }
    return '';
  }

  get errorFecha() {
    const error = this.cursoForm.controls['fecha'].errors;
    if (error) {
      return error['required'] ? 'La fecha es obligatoria' : error['fechaInvalida'] ? 'La fecha debe ser mayor a la actual' : '';
    }
    return '';
  }

  get errorPrecio() {
    const error = this.cursoForm.controls['precio'].errors;
    if (error) {
      return error['required'] ? 'El precio es obligatorio' : error['min'] ? 'El precio debe ser mayor a 0' : '';
    }
    return '';
  }

  get errorImgs() {
    const error = this.cursoForm.controls['imgs'].errors;
    if (error) {
      return error['required'] ? 'Las imágenes son obligatorias' : error['minlength'] ? 'Debe seleccionar al menos una imagen' : '';
    }
    return '';
  }

  ngOnInit(): void {
    if (this.idCurso) {
      this.editar = true;
      this.cargarDatos();
    } else {
      this.cursoForm.controls['imgs'].setValidators([Validators.required, Validators.minLength(1)]);
    }
  }

  cargarDatos() {
    this.cargandoInicio = true;
    this.firestoreSvc.getDoc('Cursos', this.idCurso).subscribe((curso: any) => {
      this.cursoForm.setValue({
        nombre: curso.nombre,
        certif: curso.certif,
        duracion: curso.duracion,
        horario: curso.horario,
        modalidad: curso.modalidad,
        fecha: curso.fecha,
        precio: curso.precio,
        imgs: []
      });
      this.cargandoInicio = false;
    });
  }

  validarCampos(campo: string) {
    return this.cursoForm.controls[campo].errors && this.cursoForm.controls[campo].touched;
  }

  guardar() {
    if (this.cursoForm.invalid) {
      this.cursoForm.markAllAsTouched();
      return;
    }
    this.asignarDatos();
    if (!this.editar) {
      //Guardar nuevo curso
      this.subirImgs(this.imgsStorage);
    } else {
      //Guardar curso editado
      this.guardarCambios();
    }
  }

  onChangeImgs(event: any) {
    if (this.imgsStorage.length > 0) {
      this.imgsStorage = [];
      this.imgs = [];
    }
    this.imgsStorage.push(...event.target.files);
    this.imgsStorage.forEach(img => {
      const reader = new FileReader();
      reader.onload = (i) => {
        this.imgs.push(i.target?.result);
      }
      reader.readAsDataURL(img);
    });
  }

  asignarDatos() {
    let id
    if (this.idCurso) {
      id = this.idCurso
    } else {
      id = this.firestoreSvc.crearIdDoc()
    }
    this.curso = {
      id: id,
      nombre: this.cursoForm.value.nombre,
      certif: this.cursoForm.value.certif,
      duracion: this.cursoForm.value.duracion,
      horario: this.cursoForm.value.horario,
      modalidad: this.cursoForm.value.modalidad,
      fecha: this.cursoForm.value.fecha,
      precio: this.cursoForm.value.precio,
      estado: 'Activo',
      imgsUrl: []
    }
  }

  subirImgs(imgs: File[]) {
    console.log(imgs);
    console.log('Guardar nuevo curso');
    
    let imgsUrl: string[] = [];
    console.log(imgs);
    console.log(this.curso);
    this.cargandoGuardar = true;
    imgs.forEach(img => {
      this.storageSc.subirImg('Cursos', this.curso.id, img.name, img)
        .then((url) => {
          imgsUrl.push(url);
          console.log(imgsUrl);
          this.curso.imgsUrl = imgsUrl;
          this.firestoreSvc.crearDocumentoConId('Cursos', this.curso.id, this.curso).finally(() => {
            const modalRef = this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' });
            modalRef.componentInstance.info = {
              tipo: 'exito',
              icono: 'check_circle',
              titulo: 'Curso creado con éxito',
              mensaje: 'El curso se ha creado correctamente',
            };
            this.cargandoGuardar = false;
          });
        });
    });
  }

  guardarCambios() {
    console.log('Guardar curso editado');
    this.cargandoGuardar = true;
    this.firestoreSvc.actualizarDoc('Cursos', this.curso.id, this.curso).then(() => {
      const modalRef = this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' });
      modalRef.componentInstance.info = {
        tipo: 'exito',
        icono: 'check-circle',
        titulo: 'Curso editado con éxito',
        mensaje: 'El curso se ha editado correctamente',
      };
    }).
    catch((error) => {
      const modalRef = this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' });
      modalRef.componentInstance.info = {
        tipo: 'error',
        icono: 'exclamation-circle',
        titulo: 'Error al editar el curso',
        mensaje: 'Ha ocurrido un error al editar el curso, intente nuevamente',
      };
    }).
    finally(() => {
      this.cargandoGuardar = false;
    });
  }

  eliminar() {
    this.cargandoEliminar = true;
    const info: Info = {
      tipo: 'Eliminar',
      icono: 'warning',
      titulo: 'Eliminar Curso',
      mensaje: '¿Está seguro que desea eliminar el curso? \n Esta acción no se puede deshacer.',
      id: this.idCurso,
      col: 'Cursos'
    }
    this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
  }
}
