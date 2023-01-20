import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import * as L from 'leaflet';
import { FirestoreService } from '../../../services/firestore.service';
import { AuthService } from '../../../services/auth.service';
import { Ciudad } from '../../../app.interfaces';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy {

  private map: any;
  cargando: boolean = true;

  usuario: any;
  ciudades: Ciudad[] = [];
  constructor(private authSvc: AuthService, private firestoreSvc: FirestoreService) { }

  private initMap() {
    try {
      this.map = L.map('map', {
        center: [-1.1855339, -78.0652832],
        zoom: 7,
        worldCopyJump: true,
      });
      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      });

      tiles.addTo(this.map);
      console.log('mapa cargado');

    } catch {
      console.log('Error al cargar el mapa');
    }

  }

  ngAfterViewInit() {
    this.initMap();
    this.cargarMarcadores();
  }

  cargarMarcadores() {
    this.cargando = true;
    this.authSvc.getUid().then((resp) => {
      if (!resp) return;
      const uid = resp.uid;
      this.firestoreSvc.getDocs('Usuarios').subscribe((resp: any) => {
        this.usuario = resp.find((usuario: any) => usuario.uid === uid);
        const ciudadesUsuario = this.usuario.idCiudad;
        //Cargar select de ciudades del usuario
        this.firestoreSvc.getDocs('Ciudades').subscribe((resp: any) => {
          this.ciudades = resp.filter((ciudad: any) => ciudadesUsuario.includes(ciudad.id));
          console.log(this.ciudades);
          this.firestoreSvc.getDocs('Ventas').subscribe((resp: any[]) => {
            const ventas = resp.filter((venta: any) => ciudadesUsuario.includes(venta.idCiudad));
            console.log(ventas);
            const icon = {
              icon: L.icon({
                iconSize: [25, 41],
                iconAnchor: [13, 41],
                iconUrl: '/assets/img/marker.svg',
              })
            }
            let cursosPorCiudad: any[] = [];
            this.ciudades.forEach((ciudad: any) => {
              ventas.forEach((venta: any) => {
                if (venta.idCiudad !== ciudad.id) {
                  console.log(`no hay ventas en ${ciudad.nombre}`);
                } else {
                  cursosPorCiudad.push({
                    ciudad: ciudad.nombre,
                    precio: venta.precio,
                  });
                }
              });
              const marker = L.marker([ciudad.lat, ciudad.lng], icon).addTo(this.map);
              marker.bindPopup(`
                <div class="card">
                  <div class="card-header">
                    <h3>${ciudad.nombre}</h3>
                    </div>
                  <div class="card-body">
                    <p class="card-text"># Cursos vendidos: ${cursosPorCiudad.length}</p>
                    <p class="card-text">Total: ${cursosPorCiudad.reduce((acc: any, cur: any) => acc + cur.precio, 0)}</p>
                  </div>
                </div>
                      `);
            });
            
              // const ventaCiudad = ventas.find((venta: any) => venta.idCiudad === ciudad.id);
              // console.log(ventaCiudad);
              
              // const numCursos = ventaCiudad ? ventaCiudad.numCursos : 0;
              // const total = ventaCiudad ? ventaCiudad.total : 0;
              // const marker = L.marker([ciudad.lat, ciudad.lng], icon).addTo(this.map);
              // marker.bindPopup(`
              //   <div class="card">
              //     <div class="card-header">
              //       <h4>${ciudad.nombre}</h4>
              //     </div>
              //     <div class="card-body">
              //       <h5 class="card-title>${ciudad.nombre}</h5>
              //       <p class="card-text"># Cursos vendidos: ${numCursos}</p>
              //       <p class="card-text">Total: ${total}</p>
              //     </div>
              //   </div>
              // `);
            this.cargando = false;
            });
          });
        });
      });
    }

  ngOnDestroy() {
      this.map.remove();
      console.log('mapa eliminado');

    }

}
