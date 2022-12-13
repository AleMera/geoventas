import { AfterViewInit, Component, OnDestroy } from '@angular/core';

import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss']
})
export class MapaComponent implements AfterViewInit, OnDestroy {

  private map: any;
  private initMap() {
    try {
      this.map = L.map('map', {
        center: [-1.1855339,-78.0652832],
        zoom: 7
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

  constructor() { }

  ngAfterViewInit() {
    this.initMap();
  }

  ngOnDestroy() {
    this.map.remove();
    console.log('mapa eliminado');

  }

}
