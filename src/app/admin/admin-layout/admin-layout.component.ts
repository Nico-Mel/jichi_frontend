import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  private router = inject(Router);

  readonly adminEmail = this.decodeEmail();
  readonly adminInitials = this.adminEmail
    .split('@')[0]
    .slice(0, 2)
    .toUpperCase();

  private decodeEmail(): string {
    const token = localStorage.getItem('access_token');
    if (!token) return 'admin@jichi.bo';
    try {
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(atob(b64));
      return payload.email ?? payload.sub ?? payload.username ?? 'admin@jichi.bo';
    } catch {
      return 'admin@jichi.bo';
    }
  }

  linkClass(isActive: boolean): string {
    const base =
      'flex items-center gap-3 px-4 py-2.5 rounded-xl mx-3 mb-0.5 transition-all duration-150 cursor-pointer';
    return isActive
      ? `${base} bg-jichi-accent/15 text-jichi-accent`
      : `${base} text-white/60 hover:text-white hover:bg-white/5`;
  }

  iconBg(isActive: boolean): string {
    const base = 'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0';
    return isActive ? `${base} bg-jichi-accent/25` : `${base} bg-white/5`;
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/auth']);
  }
}
