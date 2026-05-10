import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../core/services/api.service';

type Tab = 'login' | 'register';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './auth.component.html',
})
export class AuthComponent {
  private fb     = inject(FormBuilder);
  private api    = inject(ApiService);
  private router = inject(Router);

  activeTab       = signal<Tab>('login');
  isLoading       = signal(false);
  errorMsg        = signal<string | null>(null);
  successMsg      = signal<string | null>(null);
  showLoginPwd    = signal(false);
  showRegisterPwd = signal(false);

  loginForm = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  registerForm = this.fb.nonNullable.group({
    nombre:   ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  setTab(tab: Tab): void {
    this.activeTab.set(tab);
    this.errorMsg.set(null);
    this.successMsg.set(null);
    this.loginForm.reset();
    this.registerForm.reset();
    this.showLoginPwd.set(false);
    this.showRegisterPwd.set(false);
  }

  hasError(form: 'login' | 'register', field: string): boolean {
    const ctrl = form === 'login'
      ? this.loginForm.get(field)
      : this.registerForm.get(field);
    return !!(ctrl?.invalid && ctrl?.touched);
  }

  submitLogin(): void {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMsg.set(null);

    const { email } = this.loginForm.getRawValue();

    this.api.login({ email }).subscribe({
      next: (tokens) => {
        const isAdmin = email.toLowerCase().includes('admin');
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('role', isAdmin ? 'admin' : 'operador');
        localStorage.setItem('user_name', email.split('@')[0]);
        this.isLoading.set(false);
        void this.router.navigate(isAdmin ? ['/admin', 'dashboard'] : ['/']);
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMsg.set('Correo no registrado o credenciales inválidas.');
      },
    });
  }

  submitRegister(): void {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.invalid || this.isLoading()) return;

    this.isLoading.set(true);
    this.errorMsg.set(null);

    // Theatre logic: no real endpoint
    setTimeout(() => {
      this.isLoading.set(false);
      this.successMsg.set('¡Cuenta creada correctamente! Redirigiendo al login...');
      this.registerForm.reset();
      this.showRegisterPwd.set(false);
      setTimeout(() => this.setTab('login'), 2000);
    }, 1200);
  }
}
