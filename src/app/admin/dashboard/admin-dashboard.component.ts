import { Component, OnInit, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import type {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexPlotOptions,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../core/services/api.service';
import { KpiPanel } from '../../core/models/models';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [DecimalPipe, NgApexchartsModule],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent implements OnInit {
  private api = inject(ApiService);

  // ── State ──────────────────────────────────────────────────────────────
  loading   = signal(true);
  error     = signal<string | null>(null);
  kpis      = signal<KpiPanel | null>(null);
  mlRunning = signal(false);
  mlSuccess = signal(false);
  mlError   = signal<string | null>(null);

  readonly skeletonItems = [1, 2, 3, 4, 5];
  latestProjection = '—';

  // Compliance values shown below the gauge
  complianceMeta   = 0;
  complianceActual = 0;

  // ── Trend Chart ────────────────────────────────────────────────────────
  trendSeries: ApexAxisChartSeries = [];

  readonly trendChart: ApexChart = {
    type:       'area',
    height:     340,
    toolbar:    { show: false },
    zoom:       { enabled: false },
    animations: { enabled: true, speed: 700, dynamicAnimation: { speed: 350 } },
    fontFamily: 'Poppins, sans-serif',
    background: 'transparent',
  };

  readonly trendColors = ['#374151', '#84CC16'];

  readonly trendStroke: ApexStroke = {
    curve:     'smooth',
    width:     [2, 2.5],
    dashArray: [0, 6],
  };

  readonly trendFill: ApexFill = {
    type: 'gradient',
    gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.02, stops: [0, 90, 100] },
  };

  readonly trendXAxis: ApexXAxis = {
    type:       'category',
    axisBorder: { show: false },
    axisTicks:  { show: false },
    labels: {
      rotate: -30,
      style:  { fontFamily: 'Poppins, sans-serif', fontSize: '11px', colors: '#737373' },
    },
    crosshairs: { show: true },
  };

  readonly trendYAxis: ApexYAxis = {
    min:  1500,
    labels: {
      formatter: (v: number) => `${(v / 1000).toFixed(1)}k t`,
      style:     { fontFamily: 'Poppins, sans-serif', fontSize: '11px', colors: '#737373' },
    },
  };

  readonly trendGrid: ApexGrid = {
    borderColor:     '#E5E5E5',
    strokeDashArray: 4,
    yaxis: { lines: { show: true } },
    xaxis: { lines: { show: false } },
    padding: { left: 4, right: 8 },
  };

  readonly trendLegend: ApexLegend = {
    show:            true,
    position:        'top',
    horizontalAlign: 'right',
    fontFamily:      'Poppins, sans-serif',
    fontSize:        '12px',
    fontWeight:      500,
    itemMargin:      { horizontal: 12 },
  };

  readonly trendTooltip: ApexTooltip = {
    shared:    true,
    intersect: false,
    y: { formatter: (v: number) => `${v.toLocaleString('es-BO')} t/día` },
    style: { fontFamily: 'Poppins, sans-serif', fontSize: '12px' },
  };

  readonly trendDataLabels: ApexDataLabels = { enabled: false };

  // ── Compliance Gauge (Radial Bar) ──────────────────────────────────────
  complianceSeries: ApexNonAxisChartSeries = [0];

  readonly complianceChart: ApexChart = {
    type:       'radialBar',
    height:     260,
    toolbar:    { show: false },
    animations: { enabled: true, speed: 800 },
    fontFamily: 'Poppins, sans-serif',
    background: 'transparent',
  };

  readonly complianceColors = ['#84CC16'];
  readonly complianceLabels = ['Completado'];

  readonly compliancePlotOptions: ApexPlotOptions = {
    radialBar: {
      startAngle: -130,
      endAngle:    130,
      hollow: {
        size:       '68%',
        background: 'transparent',
      },
      track: {
        background:  '#E5E5E5',
        strokeWidth: '100%',
        margin:       4,
      },
      dataLabels: {
        name: {
          show:       true,
          fontSize:   '12px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 600,
          color:      '#737373',
          offsetY:    -10,
        },
        value: {
          show:       true,
          fontSize:   '28px',
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 700,
          color:      '#262626',
          offsetY:     6,
          formatter:  (val: number) => `${val.toFixed(1)}%`,
        },
      },
    },
  };

  // ── Lifecycle ──────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadAll();
  }

  private loadAll(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      kpis:       this.api.getKpis(),
      historico:  this.api.getGraficoSemana(),
      proyeccion: this.api.getProyeccionSemana(),
    }).subscribe({
      next: ({ kpis, historico, proyeccion }) => {
        this.kpis.set(kpis);

        // Build trend series with formatted date labels
        const lastH = historico.at(-1);
        this.trendSeries = [
          {
            name: 'Recolección Real',
            data: historico.map((d) => ({ x: this.formatFecha(d.fecha), y: d.total_toneladas })),
          },
          {
            name: 'Proyección IA',
            data: [
              ...(lastH ? [{ x: this.formatFecha(lastH.fecha), y: lastH.total_toneladas }] : []),
              ...proyeccion.map((d) => ({ x: this.formatFecha(d.fecha), y: d.toneladas_proyectadas })),
            ],
          },
        ];

        this.latestProjection = proyeccion.at(-1)
          ? proyeccion.at(-1)!.toneladas_proyectadas.toFixed(0)
          : '—';

        // Compliance gauge
        this.complianceMeta   = Math.round(kpis.ml_random_forest_prediccion_toneladas / 12);
        this.complianceActual = kpis.operativo_toneladas_mes_actual;
        const pct = this.complianceMeta > 0
          ? Math.min(100, (this.complianceActual / this.complianceMeta) * 100)
          : 0;
        this.complianceSeries = [parseFloat(pct.toFixed(1))];

        this.loading.set(false);
      },
      error: () => {
        this.error.set(
          'No se pudieron cargar los datos del panel. Verifique la conexión con el servidor.',
        );
        this.loading.set(false);
      },
    });
  }

  runMl(): void {
    if (this.mlRunning()) return;
    this.mlRunning.set(true);
    this.mlSuccess.set(false);
    this.mlError.set(null);

    this.api.runMl().subscribe({
      next: () => {
        this.mlRunning.set(false);
        this.mlSuccess.set(true);
        this.loadAll();
      },
      error: () => {
        this.mlRunning.set(false);
        this.mlError.set('Error al ejecutar los modelos de IA. Intente nuevamente.');
      },
    });
  }

  private formatFecha(fecha: string): string {
    const [y, m, d] = fecha.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    const dias = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    return `${dias[date.getDay()]} ${String(d).padStart(2, '0')}`;
  }
}
