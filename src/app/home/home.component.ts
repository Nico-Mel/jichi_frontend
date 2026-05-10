import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  HostListener,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, DecimalPipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';
import { AlertaRequest } from '../core/models/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, DecimalPipe, RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit, OnDestroy {
  private fb         = inject(FormBuilder);
  private api        = inject(ApiService);
  private platformId = inject(PLATFORM_ID);

  // UI state
  modalOpen     = signal(false);
  formSubmitted = signal(false);
  formError     = signal<string | null>(null);
  isSubmitting  = signal(false);
  navScrolled   = signal(false);

  // KPI counters
  kpiToneladas = signal(0);
  kpiCamiones  = signal(0);
  kpiZonas     = signal(0);

  // Hero carousel
  currentSlide = signal(0);

  readonly slides = [
    {
      url:   'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80',
      alt:   'Ciudad inteligente y sostenible',
    },
    {
      url:   'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1920&q=80',
      alt:   'Recolección ciudadana de residuos',
    },
    {
      url:   'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1920&q=80',
      alt:   'Naturaleza y medio ambiente',
    },
  ];

  private slideInterval: ReturnType<typeof setInterval> | null = null;

  readonly tiposProblema = [
    'Contenedor desbordado',
    'Contenedor dañado o vandalizdo',
    'Zona no recolectada a tiempo',
    'Basura acumulada en vía pública',
    'Mal olor persistente',
    'Otro',
  ];

  alertaForm = this.fb.nonNullable.group({
    zona_barrio:    ['', Validators.required],
    tipo_problema:  ['', Validators.required],
    id_contenedor:  [''],
  });

  @HostListener('window:scroll')
  onScroll(): void {
    this.navScrolled.set(window.scrollY > 60);
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.api.getKpis().subscribe({
        next: (kpis) => {
          this.animateCounter((v) => this.kpiToneladas.set(v), kpis.operativo_toneladas_mes_actual, 2200);
          this.animateCounter((v) => this.kpiCamiones.set(v), 30,   1800);
          this.animateCounter((v) => this.kpiZonas.set(v),  1000,   1800);
        },
        error: () => {
          this.animateCounter((v) => this.kpiCamiones.set(v), 30,   1800);
          this.animateCounter((v) => this.kpiZonas.set(v),  1000,   1800);
        },
      });
      this.slideInterval = setInterval(() => {
        this.currentSlide.set((this.currentSlide() + 1) % this.slides.length);
      }, 5000);
    }
  }

  ngOnDestroy(): void {
    if (this.slideInterval) clearInterval(this.slideInterval);
  }

  private animateCounter(setter: (v: number) => void, target: number, ms: number): void {
    const start = performance.now();
    const tick  = (now: number) => {
      const p     = Math.min((now - start) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setter(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  openModal(): void {
    this.modalOpen.set(true);
    this.formSubmitted.set(false);
    this.formError.set(null);
    this.isSubmitting.set(false);
    this.alertaForm.reset();
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.modalOpen.set(false);
    document.body.style.overflow = '';
  }

  scrollTo(id: string): void {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  goToSlide(i: number): void {
    this.currentSlide.set(i);
  }

  submitAlerta(): void {
    this.alertaForm.markAllAsTouched();
    if (this.alertaForm.invalid || this.isSubmitting()) return;

    this.isSubmitting.set(true);
    this.formError.set(null);

    const v = this.alertaForm.getRawValue();
    const payload: AlertaRequest = {
      id_usuario:    crypto.randomUUID(),
      id_contenedor: v.id_contenedor || crypto.randomUUID(),
      zona_barrio:   v.zona_barrio,
      tipo_problema: v.tipo_problema,
    };

    this.api.crearAlerta(payload).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.formSubmitted.set(true);
      },
      error: () => {
        this.isSubmitting.set(false);
        this.formError.set('No se pudo enviar la alerta. Por favor intente nuevamente.');
      },
    });
  }
}
