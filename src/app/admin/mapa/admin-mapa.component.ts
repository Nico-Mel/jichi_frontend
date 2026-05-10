import {
  Component,
  AfterViewInit,
  OnDestroy,
  inject,
  signal,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as L from 'leaflet';
import { ApiService } from '../../core/services/api.service';
import { Contenedor } from '../../core/models/models';

@Component({
  selector: 'app-admin-mapa',
  standalone: true,
  imports: [],
  templateUrl: './admin-mapa.component.html',
})
export class AdminMapaComponent implements AfterViewInit, OnDestroy {
  private api        = inject(ApiService);
  private platformId = inject(PLATFORM_ID);

  loading   = signal(true);
  error     = signal<string | null>(null);
  stats     = signal({ total: 0, risk: 0, safe: 0 });
  showRisk  = signal(true);
  showSafe  = signal(true);

  private map!: L.Map;
  private riskLayer!: L.LayerGroup;
  private safeLayer!: L.LayerGroup;

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.initMap(), 50);
    }
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  private initMap(): void {
    this.map = L.map('mapa-calor', {
      center: [-17.7863, -63.1812],
      zoom: 12,
      preferCanvas: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 18,
    }).addTo(this.map);
    this.riskLayer = L.layerGroup().addTo(this.map);
    this.safeLayer = L.layerGroup().addTo(this.map);
    this.loadData();
  }

  private loadData(): void {
    this.api.getContenedores().subscribe({
      next:  (data) => this.renderAll(data),
      error: ()     => { this.error.set('No se pudieron cargar los datos del mapa.'); this.loading.set(false); },
    });
  }

  private renderAll(data: Contenedor[]): void {
    this.riskLayer.clearLayers();
    this.safeLayer.clearLayers();
    let riskCount = 0;

    data.forEach((c) => {
      const lat = parseFloat(c.latitud);
      const lng = parseFloat(c.longitud);
      if (isNaN(lat) || isNaN(lng)) return;

      const rv      = c.riesgo_desborde_clasificacion?.toUpperCase() ?? '';
      const isRisk  = rv === 'SÍ' || rv === 'SI' || rv === '1' || rv === 'YES';
      if (isRisk) riskCount++;

      const marker = L.circleMarker([lat, lng], {
        radius:      isRisk ? 10 : 6,
        fillColor:   isRisk ? '#EF4444' : '#84CC16',
        color:       isRisk ? '#B91C1C' : '#4D7C0F',
        weight:      1.5,
        opacity:     0.9,
        fillOpacity: isRisk ? 0.85 : 0.5,
      }).bindPopup(
        `<div style="font-family:'Poppins',sans-serif;font-size:13px;min-width:170px">
          <p style="font-weight:700;margin:0 0 6px;color:#262626">Contenedor</p>
          <p style="margin:2px 0;color:#737373">Zona: <b>${c.zona_barrio}</b></p>
          <p style="margin:2px 0;color:#737373">Cluster: <b>${c.cluster_asignado}</b></p>
          <p style="margin:6px 0 0;font-weight:700;color:${isRisk ? '#EF4444' : '#16A34A'}">
            ${isRisk ? '⚠ Riesgo de Desborde' : '✓ Sin Riesgo Inmediato'}
          </p>
        </div>`,
      );

      (isRisk ? this.riskLayer : this.safeLayer).addLayer(marker);
    });

    this.stats.set({ total: data.length, risk: riskCount, safe: data.length - riskCount });
    this.loading.set(false);
  }

  toggleRisk(): void {
    const next = !this.showRisk();
    this.showRisk.set(next);
    next ? this.riskLayer.addTo(this.map) : this.map.removeLayer(this.riskLayer);
  }

  toggleSafe(): void {
    const next = !this.showSafe();
    this.showSafe.set(next);
    next ? this.safeLayer.addTo(this.map) : this.map.removeLayer(this.safeLayer);
  }
}
