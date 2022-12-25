import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {

  registroForm = this.fBuilder.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    tipos: [[], Validators.required],
    passwd: ['', [Validators.required, Validators.minLength(8)]],
    passwd2: ['', [Validators.required, Validators.minLength(8)]],
  });

  tipos: string[] = ['Administrador', 'Cliente'];
  cargando: boolean = false;

  constructor(private fBuilder: FormBuilder) { }

  ngOnInit(): void {
  }

  guardar() {
  }

  onChangeTipo(e: any) {
  }
}
