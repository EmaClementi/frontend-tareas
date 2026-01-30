type Estadisticas = {
  totalTareas: number;
  tareasCompletadas: number;
  tareasPendientes: number;
  tareasEnProgreso: number;
  tareasCanceladas: number;
  tareasVencidas: number;
  tareasCompletadasHoy: number;
  tareasCompletadasEstaSemana: number;
  tareasPorEstado: Record<string, number>;
  tareasPorImportancia: Record<string, number>;
  porcentajeCompletado: number;
  porcentajePendiente: number;
  porcentajeEnProgreso: number;
  porcentajeCancelado: number;
  porcentajeVencido: number;
};

export type {Estadisticas as default};