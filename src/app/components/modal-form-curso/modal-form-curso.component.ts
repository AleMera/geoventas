import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';

interface Alert {
  type: string;
  msj: string;
}

@Component({
  selector: 'app-modal-form-curso',
  templateUrl: './modal-form-curso.component.html',
  styleUrls: ['./modal-form-curso.component.scss']
})
export class ModalFormCursoComponent implements OnInit {

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
  alert!: Alert;
  curso: any;
  imgs: any[] = [];
  imgsStorage: any[] = [];


  constructor(protected modal: NgbModal, private fBuilder: FormBuilder, private firestoreSvc: FirestoreService, private storageSc: StorageService) { }

  ngOnInit(): void {
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
    // this.firestoreSvc.crearDocumentoConId('Cursos', this.curso.id, this.curso)
    //   .then(() => {
    //     this.alert = {
    //       type: 'success',
    //       msj: 'Nuevo curso registrado exitosamente.'
    //     }
    //   })
    //   .catch((error) => {
    //     this.alert = {
    //       type: 'danger',
    //       msj: 'No se ha podido registrar el curso.'
    //     }
    //   })
    //   .finally(() => {
    //     this.subirImgs(this.imgsStorage);
    //     this.cargando = false;
    //     location.reload();
    //   });
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

  cerrar() {
    this.modal.dismissAll();
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

    // this.subirImgs(this.imgsStorage);
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
          this.firestoreSvc.crearDocumentoConId('Cursos', this.curso.id, this.curso);
        });
    });
  }

}
