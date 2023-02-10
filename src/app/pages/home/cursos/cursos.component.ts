import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit {

  cursos: any[] = [];

  constructor(private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.firestoreSvc.getDocs('Cursos').subscribe((res) => {
      this.cursos = res;
    });
  }

}
