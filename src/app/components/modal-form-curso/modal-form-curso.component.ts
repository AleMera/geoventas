import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { Info } from 'src/app/app.interfaces';

@Component({
  selector: 'app-modal-form-curso',
  templateUrl: './modal-form-curso.component.html',
  styleUrls: ['./modal-form-curso.component.scss']
})
export class ModalFormCursoComponent implements OnInit {

  @Input() curso!: any;

  cursoForm: FormGroup = this.fBuilder.group({
    nombre: ['', Validators.required],
    certif: ['', Validators.required],
    duracion: ['', Validators.required],
    horario: ['', Validators.required],
    modalidad: ['', Validators.required],
    fecha: ['', Validators.required],
    precio: ['', Validators.required],
    imgs: [null, [Validators.required, Validators.minLength(1)]],
  });

  modalidades = ['Presencial', 'Virtual'];
  cargando: boolean = false;
  finalizado: boolean = false;
  imgs: any[] = [];
  imgsStorage: any[] = [];
  editar: boolean = false;

  constructor(protected modal: NgbModal, private fBuilder: FormBuilder, private firestoreSvc: FirestoreService, private storageSc: StorageService) { }

  ngOnInit(): void {
    console.log(this.curso);
    (this.curso) ? this.cargarDatos() : null;
    (this.curso) ? this.editar = true : false;
  }

  cargarDatos() {
    this.cursoForm.setValue({
      nombre: this.curso.nombre,
      duracion: this.curso.duracion,
      horario: this.curso.horario,
      modalidad: this.curso.modalidad,
      certif: this.curso.certif,
      fecha: this.curso.fecha,
      precio: this.curso.precio,
      imgs: this.curso.imgsUrl
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
    this.cargando = true;
    this.asignarDatos();
    this.subirImgs(this.imgsStorage);
  }

  eliminar() {
    this.cargando = true;
    const info: Info = {
      tipo: 'Eliminar',
      icono: 'warning',
      titulo: 'Eliminar Curso',
      mensaje: '¿Está seguro que desea eliminar el curso? \n Esta acción no se puede deshacer.',
      id: this.curso.id,
      col: 'Cursos'
    }
    this.modal.open(ModalInfoComponent, { centered: true, size: 'sm' }).componentInstance.info = info;
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
    this.curso = {
      id: this.firestoreSvc.crearIdDoc(),
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
    console.log(this.imgsStorage);

  }

  subirImgs(imgs: File[]) {
    let imgsUrl: string[] = [];
    console.log(imgs);
    console.log(this.curso);

    imgs.forEach(img => {
      this.storageSc.subirImg('Cursos', this.curso.id, img.name, img)
        .then((url) => {
          imgsUrl.push(url);
          console.log(imgsUrl);
          this.curso.imgsUrl = imgsUrl;
          this.firestoreSvc.crearDocumentoConId('Cursos', this.curso.id, this.curso).finally(() => {
            this.cargando = false;
            location.reload();
          });
        });

    });
  }

}
