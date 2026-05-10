// Auth
export interface LoginRequest {
  email: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

// Alertas Públicas
export interface AlertaRequest {
  id_usuario: string;
  id_contenedor: string;
  zona_barrio: string;
  tipo_problema: string;
}

// Contenedores para Mapa
export interface Contenedor {
  id_contenedor: string;
  zona_barrio: string;
  latitud: string;
  longitud: string;
  cluster_asignado: string;
  riesgo_desborde_clasificacion: string;
}

// Gráfico Histórico
export interface DatoHistorico {
  fecha: string;
  total_toneladas: number;
}

// Proyección Futura
export interface DatoProyeccion {
  fecha: string;
  toneladas_proyectadas: number;
}

// KPIs Panel Admin
export interface KpiPanel {
  operativo_alertas_pendientes: number;
  operativo_toneladas_mes_actual: number;
  ml_kmeans_contenedores_criticos: number;
  ml_arbol_riesgo_inminente: number;
  ml_random_forest_prediccion_toneladas: number;
}
