import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-eliminar-user',
  templateUrl: './modal-eliminar-user.component.html',
  styleUrls: ['./modal-eliminar-user.component.scss']
})
export class ModalEliminarUserComponent implements OnInit {

  @Input() idCliente!: number;
  constructor(protected modal: NgbModal) { }

  ngOnInit(): void {
  }

  eliminar() {
    this.modal.dismissAll();
  }

}
