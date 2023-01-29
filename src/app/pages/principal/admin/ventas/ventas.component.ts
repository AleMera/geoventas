import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Ciudad } from '../../../../app.interfaces';
import { FirestoreService } from '../../../../services/firestore.service';

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.scss']
})
export class VentasComponent implements OnInit {

  ciudades: Ciudad[] = [];
  ventas: any[] = [];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

  total: number;
  
  constructor(private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      language: {
        url: '//cdn.datatables.net/plug-ins/1.10.22/i18n/Spanish.json'
      },
      pageLength: 10,
      lengthMenu: [10, 25, 50, 100],
      responsive: false,
      processing: true,
      scrollY: '400px',
      retrieve: true,
    };
    this.cargarData();
  }

  cargarData() {
    this.firestoreSvc.getDocs('Ventas').subscribe((ventas: any) => {
      this.firestoreSvc.getDocs('Ciudades').subscribe((ciudades: any) => {
        this.ciudades = ciudades.filter((ciudad: any) => ventas.some((venta: any) => venta.idCiudad === ciudad.id));
        this.ciudades.sort(this.ordenarAlfabeticamente);
        this.firestoreSvc.getDocs('Clientes').subscribe((clientes: any) => {
          clientes = clientes.filter((cliente: any) => ventas.some((venta: any) => venta.idCliente === cliente.id));
          this.firestoreSvc.getDocs('Cursos').subscribe((cursos: any) => {
            cursos = cursos.filter((curso: any) => ventas.some((venta: any) => venta.idCurso === curso.id));
            this.ventas = ventas.map((venta: any) => {
              venta.cliente = `${clientes.find((cliente: any) => cliente.id === venta.idCliente).nombre} ${clientes.find((cliente: any) => cliente.id === venta.idCliente).apellido}`;
              venta.ciudad = this.ciudades.find((ciudad: any) => ciudad.id === venta.idCiudad)?.nombre;
              venta.curso = cursos.find((curso: any) => curso.id === venta.idCurso).nombre;
              venta.fecha = venta.fecha.toDate();
              return venta;
            });
            this.total = this.ventas.reduce((total: number, venta: any) => total + venta.precio, 0);
            this.dtTrigger.next(null);
          });
        });
      });
    });
  }

  cambiarCiudad(event: any) {
    const idCiudad = event.target.value;
    this.ventas = [];
    this.total = 0;
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.destroy();
    });
    if (!idCiudad) {
      this.cargarData();
      return;
    }
    //TODO: Filtrar por ciudad
    this.firestoreSvc.getDocs('Ventas').subscribe((ventas: any) => {
      ventas = ventas.filter((venta: any) => venta.idCiudad === idCiudad);
      this.firestoreSvc.getDocs('Clientes').subscribe((clientes: any) => {
        clientes = clientes.filter((cliente: any) => ventas.some((venta: any) => venta.idCliente === cliente.id));
        this.firestoreSvc.getDocs('Cursos').subscribe((cursos: any) => {
          cursos = cursos.filter((curso: any) => ventas.some((venta: any) => venta.idCurso === curso.id));
          this.ventas = ventas.map((venta: any) => {
            venta.cliente = `${clientes.find((cliente: any) => cliente.id === venta.idCliente).nombre} ${clientes.find((cliente: any) => cliente.id === venta.idCliente).apellido}`;
            venta.ciudad = this.ciudades.find((ciudad: any) => ciudad.id === venta.idCiudad)?.nombre;
            venta.curso = cursos.find((curso: any) => curso.id === venta.idCurso).nombre;
            venta.fecha = venta.fecha.toDate();
            return venta;
          });
          this.total = this.ventas.reduce((total: number, venta: any) => total + venta.precio, 0);
          this.dtTrigger.next(null);
        });
      });
    });
  }

  cargarTodo() {
    throw new Error('Method not implemented.');
  }

  ordenarAlfabeticamente(a: any, b: any) {
    if (a.nombre < b.nombre) {
      return -1;
    }
    if (a.nombre > b.nombre) {
      return 1;
    }
    return 0;
  }
}
