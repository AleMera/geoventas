import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-info-curso',
  templateUrl: './info-curso.component.html',
  styleUrls: ['./info-curso.component.scss']
})
export class InfoCursoComponent implements OnInit, OnDestroy {

  //TODO: Cambiar any por el tipo de dato correcto
  curso: any = {
    id: '',
    nombre: '',
    horario: '', 
    modalidad: '', 
    fecha: '',
    certif: "",
    duracion: 0,
    estado: "",
    imgsUrl: [],
    precio: 0
  };
  idCurso!: string;
  cargando: boolean = true;
  constructor(private rutaActiva: ActivatedRoute, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.rutaActiva.params.subscribe(resp => {
      this.idCurso = resp['id'];
      console.log(resp['id']);
      this.firestoreSvc.getDoc('Cursos', this.idCurso).subscribe((res) => {
        this.curso = res;
        console.log(this.curso);
        this.cargando = false;
      });
    });
  }

  ngOnDestroy(): void {
    console.log('Destruyendo componente');
    this.cargando = true;
  }

}
