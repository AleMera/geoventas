import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Info } from 'src/app/pages/auth/registro/registro.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss']
})
export class ModalInfoComponent implements OnInit {

  @Input() info!: Info;

  constructor(private router: Router, protected modal: NgbModal) { }

  ngOnInit(): void {
    console.log(this.info);
  }

  aceptar() {
    if (this.info.id) {
      this.modal.dismissAll();
      console.log("ID: " + this.info.id + "Eliminado.");
      return;
    }
    if (this.info.tipo === 'error') {
      this.modal.dismissAll();
      return;
    } else {
      this.router.navigate(['/principal'])
        .finally(() => {
          this.modal.dismissAll();
        });
    }
  }
}
