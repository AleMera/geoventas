import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { AuthService } from '../../../../services/auth.service';
import { FirestoreService } from '../../../../services/firestore.service';
import { Ciudad } from '../../../../app.interfaces';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  usuario: any;
  ciudades: Ciudad[] = [];
  totalVentas: any[] = [];
  totalCursos: any[] = [];
  comision: number = 0;

  cargando: boolean = false;

  constructor(private authSvc: AuthService, private firestoreSvc: FirestoreService) { }

  ngOnInit(): void {
    this.cargarData();
  }

  cargarData() {
    this.cargando = true;
    this.authSvc.getUid().then((resp) => {
      if (!resp) return;
      const uid = resp.uid;
      this.firestoreSvc.getDocs('Usuarios').subscribe((resp: any) => {
        this.usuario = resp.find((usuario: any) => usuario.uid === uid);
        const ciudadesUsuario = this.usuario.idCiudad;
        this.firestoreSvc.getDocs('Ciudades').subscribe((resp: any) => {
          this.ciudades = resp.filter((ciudad: any) => ciudadesUsuario.includes(ciudad.id));
          this.firestoreSvc.getDocs('Ventas').subscribe((resp: any[]) => {
            const ventas = resp.filter((venta: any) => ciudadesUsuario.includes(venta.idCiudad));
            let cursosPorCiudad: any[] = [];
            this.ciudades.forEach((ciudad: any) => {
              ventas.forEach((venta: any) => {
                if (venta.idCiudad !== ciudad.id) return
                cursosPorCiudad.push({
                  ciudad: ciudad.nombre,
                  precio: venta.precio,
                });
              });
              const ciudadVenta = cursosPorCiudad.filter((venta: any) => venta.ciudad === ciudad.nombre);
              const totalVenta = ciudadVenta.reduce((acc: any, cur: any) => acc + cur.precio, 0)
              this.totalVentas.push({
                ciudad: ciudad.nombre,
                total: totalVenta,

              })
            });
            this.pieChartTotales = {
              labels: this.totalVentas.map((venta: any) => venta.ciudad),
              datasets: [{
                data: this.totalVentas.map((venta: any) => venta.total),
              }]
            }
            this.firestoreSvc.getDocs('Cursos').subscribe((resp: any[]) => {
              const cursos = ventas.map((venta: any) => {
                const curso = resp.find((curso: any) => curso.id === venta.idCurso).nombre;
                return curso;
              });
              this.totalCursos = cursos.reduce((acc: any, cur: any) => {
                const index = acc.findIndex((item: any) => item.nombreCurso === cur);
                if (index === -1) {
                  acc.push({
                    nombreCurso: cur,
                    cantidad: 1
                  });
                } else {
                  acc[index].cantidad++;
                }
                return acc;
              }, []);
              this.pieChartCursos = {
                labels: this.totalCursos.map((curso: any) => curso.nombreCurso),
                datasets: [{
                  data: this.totalCursos.map((curso: any) => curso.cantidad),
                }]
              }
              let total: number;
              total = ventas.reduce((total: number, venta: any) => total + venta.precio, 0);
              this.comision = total * 0.1;
              
              this.cargando = false;
            });
          });
        });
      });
    });
  }

  cargarChartTotales() {

  }

  // Pie
  public pieChartOptionsTotales: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'TOTAL DE VENTAS ($) EN CADA CIUDAD'
      },
    }
  };

  public pieChartOptionsCursos: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'TOTAL DE CURSOS VENDIDOS'
      },
    }
  };

  public pieChartTotales: ChartData<'pie'>;
  public pieChartCursos: ChartData<'pie'>;

  public pieChartType: ChartType = 'pie';
}
