import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { FirestoreService } from '../../../services/firestore.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalFormCursoComponent } from '../../../components/modal-form-curso/modal-form-curso.component';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-cursos',
  templateUrl: './cursos.component.html',
  styleUrls: ['./cursos.component.scss']
})
export class CursosComponent implements OnInit, AfterViewInit, OnDestroy {

  cursos: any[] = [];

  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtInitialized: boolean = false;

  constructor(private firestoreSvc: FirestoreService, private modal: NgbModal) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      pageLength: 10,
      lengthMenu: [5, 10, 25, 50, 100],
      responsive: false,
      scrollY: '400px',
    };
  }
  
  ngAfterViewInit(): void {
    this.getData();
    // this.dtTrigger.next(null);
  }

  nuevo() {
    const modalRef = this.modal.open(ModalFormCursoComponent, { centered: true, scrollable: true });
    modalRef.componentInstance.idCurso = null;
  }

  getData() {
    this.cursos = [];
    this.firestoreSvc.getDocs('Cursos').subscribe((resp) => {
      this.cursos = resp;
      this.dtTrigger.next(null);
      // this.rerender();
    });
  }

  verInfo(idCurso: any) {
    const modalRef = this.modal.open(ModalFormCursoComponent, { centered: true, scrollable: true });
    modalRef.componentInstance.idCurso = idCurso;
  }

  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
      this.dtTrigger.next(null);
    });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy');

    this.dtTrigger.unsubscribe();
  }
}
