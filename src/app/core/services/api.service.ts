import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AlertaRequest,
  AuthTokens,
  Contenedor,
  DatoHistorico,
  DatoProyeccion,
  KpiPanel,
  LoginRequest,
} from '../models/models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly base = 'http://localhost:8000/api';

  // ── Auth ────────────────────────────────────────────────────────────────

  login(payload: LoginRequest): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(`${this.base}/token/`, payload);
  }

  // ── Alertas Públicas ─────────────────────────────────────────────────────

  crearAlerta(payload: AlertaRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/alertas/`, payload);
  }

  // ── Mapa ─────────────────────────────────────────────────────────────────

  getContenedores(): Observable<Contenedor[]> {
    return this.http.get<Contenedor[]>(`${this.base}/contenedores/`);
  }

  // ── Gráficos ──────────────────────────────────────────────────────────────

  getGraficoSemana(): Observable<DatoHistorico[]> {
    return this.http.get<DatoHistorico[]>(`${this.base}/grafico-semana/`);
  }

  getProyeccionSemana(): Observable<DatoProyeccion[]> {
    return this.http.get<DatoProyeccion[]>(`${this.base}/proyeccion-semana/`);
  }

  // ── KPIs Admin ────────────────────────────────────────────────────────────

  getKpis(): Observable<KpiPanel> {
    return this.http.get<KpiPanel>(`${this.base}/kpis/`);
  }

  // ── ML ────────────────────────────────────────────────────────────────────

  runMl(): Observable<void> {
    return this.http.post<void>(`${this.base}/run-ml/`, {}, {
      headers: this.authHeaders(),
    });
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  private authHeaders(): HttpHeaders {
    const token = localStorage.getItem('access_token');
    return new HttpHeaders(token ? { Authorization: `Bearer ${token}` } : {});
  }
}
