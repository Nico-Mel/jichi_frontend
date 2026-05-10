import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import type {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { ApiService } from '../../core/services/api.service';
import { KpiPanel } from '../../core/models/models';

@Component({
  selector: 'app-admin-barrios',
  standalone: true,
  imports: [DecimalPipe, NgApexchartsModule],
  templateUrl: './admin-barrios.component.html',
})
export class AdminBarriosComponent implements OnInit {
  private api = inject(ApiService);

  loading = signal(true);
  error   = signal<string | null>(null);
  kpis    = signal<KpiPanel | null>(null);

  // Zona data — fixed distribution matching seed_dss.py probabilities
  readonly zonas = [
    { nombre: 'Plan 3000',            criticos: 75 },
    { nombre: 'Villa 1ro de Mayo',    criticos: 65 },
    { nombre: 'Los Lotes',            criticos: 65 },
    { nombre: 'Pampa de la Isla',     criticos: 55 },
    { nombre: 'Doble Vía La Guardia', criticos: 45 },
    { nombre: 'Centro (Casco Viejo)', criticos: 35 },
    { nombre: 'Av. Santos Dumont',    criticos: 30 },
    { nombre: 'Zona Norte (Banzer)',  criticos: 15 },
    { nombre: 'Equipetrol',           criticos: 10 },
    { nombre: 'Urubó',                criticos:  5 },
  ];

  // ── Bar Chart (Nivel de Criticidad por Zona) ──────────────────────────
  readonly barSeries: ApexAxisChartSeries = [{
    name: 'Contenedores Críticos',
    data: [75, 65, 65, 55, 45, 35, 30, 15, 10, 5],
  }];

  readonly barChart: ApexChart = {
    type:       'bar',
    height:     380,
    toolbar:    { show: false },
    animations: { enabled: true, speed: 700 },
    fontFamily: 'Poppins, sans-serif',
    background: 'transparent',
  };

  readonly barColors = ['#EF4444'];

  readonly barPlotOptions: ApexPlotOptions = {
    bar: {
      horizontal:   true,
      borderRadius: 4,
      barHeight:    '55%',
    },
  };

  readonly barXAxis: ApexXAxis = {
    categories: [
      'Plan 3000', 'Villa 1ro de Mayo', 'Los Lotes', 'Pampa de la Isla',
      'Doble Vía La Guardia', 'Centro (Casco Viejo)', 'Av. Santos Dumont',
      'Zona Norte (Banzer)', 'Equipetrol', 'Urubó',
    ],
    axisBorder: { show: false },
    axisTicks:  { show: false },
    labels: {
      style: { fontFamily: 'Poppins, sans-serif', fontSize: '11px', colors: '#737373' },
    },
  };

  readonly barYAxis: ApexYAxis = {
    labels: {
      style: { fontFamily: 'Poppins, sans-serif', fontSize: '11px', colors: '#737373' },
    },
  };

  readonly barDataLabels: ApexDataLabels = {
    enabled: true,
    formatter: (val: string | number) => `${val}`,
    style: {
      fontFamily: 'Poppins, sans-serif',
      fontSize:   '11px',
      fontWeight: '600',
      colors:     ['#262626'],
    },
    offsetX: 6,
  };

  readonly barGrid: ApexGrid = {
    borderColor:     '#E5E5E5',
    strokeDashArray: 4,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
    padding: { left: 0, right: 20 },
  };

  readonly barTooltip: ApexTooltip = {
    y: { formatter: (v: number) => `${v} contenedores críticos` },
    style: { fontFamily: 'Poppins, sans-serif', fontSize: '12px' },
  };

  // ── Donut Chart (Estado de la Flota) ──────────────────────────────────
  donutSeries: ApexNonAxisChartSeries = [];

  readonly donutChart: ApexChart = {
    type:       'donut',
    height:     260,
    toolbar:    { show: false },
    animations: { enabled: true, speed: 700 },
    fontFamily: 'Poppins, sans-serif',
    background: 'transparent',
  };

  readonly donutColors  = ['#EF4444', '#84CC16'];
  readonly donutLabels  = ['Puntos Críticos', 'Operativos'];

  readonly donutPlotOptions: ApexPlotOptions = {
    pie: {
      donut: {
        size: '72%',
        labels: {
          show:  true,
          name: {
            show:       true,
            fontSize:   '11px',
            fontFamily: 'Poppins, sans-serif',
            color:      '#737373',
            offsetY:    -8,
          },
          value: {
            show:       true,
            fontSize:   '22px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 700,
            color:      '#262626',
            offsetY:     4,
          },
          total: {
            show:       true,
            label:      'Total Flota',
            fontSize:   '11px',
            fontFamily: 'Poppins, sans-serif',
            color:      '#737373',
            fontWeight: 600,
          },
        },
      },
    },
  };

  readonly donutDataLabels: ApexDataLabels = { enabled: false };

  readonly donutLegend: ApexLegend = {
    show:       false,
    fontFamily: 'Poppins, sans-serif',
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.api.getKpis().subscribe({
      next: (kpis) => {
        this.kpis.set(kpis);
        const criticos = kpis.ml_kmeans_contenedores_criticos;
        this.donutSeries = [criticos, Math.max(0, 1000 - criticos)];
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudieron cargar los datos. Verifique la conexión.');
        this.loading.set(false);
      },
    });
  }
}
