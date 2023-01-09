import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import * as L from 'leaflet';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy {

  private map: any;
  cargando: boolean = true;
  constructor(private firestroreSvc: FirestoreService) { }

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
    this.firestroreSvc.getDocs('Ciudades').subscribe((ciudades) => {
      const icon = {
        icon: L.icon({
          iconSize: [25, 41],
          iconAnchor: [13, 41],
          iconUrl: '/assets/img/marker.svg',
        })
      }
      ciudades.forEach((ciudad: any) => {
        const marker = L.marker([ciudad.lat, ciudad.lng], icon).addTo(this.map);
        marker.bindPopup(ciudad.nombre);
      });
      this.cargando = false;
    });
  }

  ngOnDestroy() {
    this.map.remove();
    console.log('mapa eliminado');

  }

}
