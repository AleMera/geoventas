import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-error',
  templateUrl: './modal-error.component.html',
  styleUrls: ['./modal-error.component.scss']
})
export class ModalErrorComponent implements OnInit {

  @Input() error!: any;
  titleMsj: string = '';
  bodyMsj: string = '';
  btnRegistro: boolean = false;
  constructor(private router: Router, protected modal: NgbModal) { }

  ngOnInit(): void {
    console.log(this.error);
    
    switch (this.error['code']) {
      case 'auth/user-not-found':
        this.titleMsj = 'Usuario no encontrado';
        this.bodyMsj = '¿Desea registrar un nuevo usuario?';
        this.btnRegistro = true;
        break;
      default:
        this.titleMsj = 'Error desconocido';
        this.bodyMsj = 'Por favor, intente más tarde o comuníquese con el administrador del sistema.';
        break;
    }
  }

  irARegistro() {
    this.router.navigate(['/auth/registro']).finally(() => {
      this.modal.dismissAll();
    });
  }
}
