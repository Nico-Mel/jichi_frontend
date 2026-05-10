import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [],
  template: `
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-jichi-dark">Usuarios</h1>
      <p class="text-jichi-muted text-sm mt-1">Gestión de cuentas y permisos del sistema.</p>
    </div>
    <div class="bg-white rounded-2xl border border-jichi-gray/50 p-12 text-center">
      <div class="w-16 h-16 bg-jichi-accent/15 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-jichi-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/>
        </svg>
      </div>
      <h3 class="text-jichi-dark font-semibold text-lg mb-2">Módulo en Desarrollo</h3>
      <p class="text-jichi-muted text-sm max-w-xs mx-auto">
        La gestión de usuarios estará disponible próximamente.
      </p>
    </div>
  `,
})
export class AdminUsuariosComponent {}
