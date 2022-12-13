import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss']
})
export class InicioComponent implements OnInit {

  cursos: any[] = [];
  cursosMostrar: any[] = [];
  limite: number = 4;
  cargando: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.cursos = [
      {
        id: 1,
        nombre: 'Audoimetría con certificación CAOHC',
        certif: 'CAOHC digital',
        duracion: 8,
        horario: 'Continuo',
        modalidad: 'Online',
        fecha: '2022-08-01',
        precio: 600
      },
      {
        id: 2,
        nombre: 'Espirometría con Certificación NIOSH',
        certif: 'Avalado por NIOSH',
        duracion: 30,
        horario: '08:00 - 16:00',
        modalidad: 'Online',
        fecha: '2022-06-01',
        precio: 450
      },
      {
        id: 3,
        nombre: 'Ingeniería de Drones test',
        certif: 'NA',
        duracion: 40,
        horario: 'Continuo',
        modalidad: 'Online',
        fecha: 'Educación continua',
        precio: 50
      },
      {
        id: 4,
        nombre: 'Coordinación de Protecciones en Redes Eléctricas en MT y BT',
        certif: 'Certiﬁcado digital de capacitación',
        duracion: 30,
        horario: '18:00 - 21:00',
        modalidad: 'Online',
        fecha: 'Mes de abril',
        precio: 130
      },
      {
        id: 5,
        nombre: 'Refrigeración Industrial y Aire Acondicionado: Operación y Mantenimiento',
        certif: 'Certiﬁcado digital de capacitación',
        duracion: 40,
        horario: '18:00 - 21:00',
        modalidad: 'Online',
        fecha: 'Mes de mayo y junio',
        precio: 250
      },
      {
        id: 6,
        nombre: 'Curso práctico: Electricidad Industrial & PLC Logo',
        certif: 'Certiﬁcado digital de capacitación con aval y registro MDT',
        duracion: 40,
        horario: '18:30 - 21:00',
        modalidad: 'Online',
        fecha: 'Mes de mayo',
        precio: 100
      },
    ];
    this.cargarMas();
  }

  /**
   * Método que carga los cursos aumentando de 3 en 3
   */
  cargarMas() {
    setTimeout(() => {
      this.cargando = !this.cargando;
      this.cursosMostrar.push(...this.cursos.splice(0, this.limite));
    }, 1000);
    this.cargando = !this.cargando;
  }

  eliminarCursos() {
    this.cursosMostrar = [];
    this.cursos = [];
  }
}
