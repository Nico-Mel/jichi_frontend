import { Component } from '@angular/core';

type EstadoSensor = 'transmitiendo' | 'alerta' | 'desborde' | 'bateria_baja';

interface Sensor {
  mac:     string;
  zona:    string;
  llenado: number;
  bateria: number;
  estado:  EstadoSensor;
}

@Component({
  selector: 'app-admin-historial',
  standalone: true,
  imports: [],
  templateUrl: './admin-historial.component.html',
})
export class AdminHistorialComponent {

  readonly sensores: Sensor[] = [
    { mac: '00:1B:44:11:3A:B7', zona: 'Plan 3000',            llenado: 92, bateria: 34, estado: 'desborde'     },
    { mac: 'A4:C3:F0:85:AC:11', zona: 'Villa 1ro de Mayo',    llenado: 88, bateria: 60, estado: 'alerta'       },
    { mac: 'D8:50:E6:23:7C:44', zona: 'Pampa de la Isla',     llenado: 75, bateria: 80, estado: 'transmitiendo'},
    { mac: '3C:22:FB:A0:19:D2', zona: 'Los Lotes',            llenado: 68, bateria: 45, estado: 'transmitiendo'},
    { mac: '7E:5A:D1:C8:3F:90', zona: 'Doble Vía La Guardia', llenado: 50, bateria: 90, estado: 'transmitiendo'},
    { mac: 'B0:7C:E3:41:6A:55', zona: 'Av. Santos Dumont',    llenado: 40, bateria: 85, estado: 'transmitiendo'},
    { mac: '1F:8B:29:70:EE:33', zona: 'Centro (Casco Viejo)', llenado: 65, bateria: 12, estado: 'bateria_baja' },
    { mac: '5C:90:A4:FF:2D:08', zona: 'Equipetrol',           llenado: 30, bateria: 95, estado: 'transmitiendo'},
    { mac: '22:44:BB:C7:9E:61', zona: 'Zona Norte (Banzer)',  llenado: 25, bateria: 98, estado: 'transmitiendo'},
    { mac: '9D:12:68:3A:B5:7F', zona: 'Urubó',                llenado: 10, bateria: 99, estado: 'transmitiendo'},
  ];

  fillBarClass(v: number): string {
    if (v >= 80) return 'bg-red-500';
    if (v >= 60) return 'bg-orange-400';
    if (v >= 40) return 'bg-yellow-400';
    return 'bg-jichi-accent';
  }

  fillTextClass(v: number): string {
    if (v >= 80) return 'text-red-600 font-bold';
    if (v >= 60) return 'text-orange-500 font-bold';
    return 'text-jichi-dark font-semibold';
  }

  batteryBarClass(v: number): string {
    if (v <= 20) return 'bg-red-500';
    if (v <= 40) return 'bg-orange-400';
    if (v <= 60) return 'bg-yellow-400';
    return 'bg-jichi-accent';
  }

  batteryTextClass(v: number): string {
    if (v <= 20) return 'text-red-600';
    return 'text-jichi-muted';
  }

  rowClass(estado: EstadoSensor): string {
    switch (estado) {
      case 'desborde':    return 'bg-red-50/60 hover:bg-red-50';
      case 'alerta':      return 'bg-orange-50/50 hover:bg-orange-50/80';
      case 'bateria_baja':return 'bg-yellow-50/50 hover:bg-yellow-50/80';
      default:            return 'hover:bg-jichi-base/70';
    }
  }

  badgeClass(estado: EstadoSensor): string {
    switch (estado) {
      case 'desborde':    return 'bg-red-100 text-red-700 border border-red-200';
      case 'alerta':      return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'bateria_baja':return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
      default:            return 'bg-green-100 text-green-700 border border-green-200';
    }
  }

  badgeLabel(estado: EstadoSensor): string {
    switch (estado) {
      case 'desborde':    return 'Desborde Inminente';
      case 'alerta':      return 'Alerta';
      case 'bateria_baja':return 'Batería Baja';
      default:            return 'Transmitiendo';
    }
  }

  badgePulse(estado: EstadoSensor): boolean {
    return estado === 'desborde' || estado === 'alerta';
  }
}
