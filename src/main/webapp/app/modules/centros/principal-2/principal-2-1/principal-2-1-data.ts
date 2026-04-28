// principal-2-1-data.ts

export interface IProject21 {
  id: number;
  nombre: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: string;
}

export const INITIAL_PROJECTS: IProject21[] = [
  { id: 1, nombre: 'Migración de Servidores Cloud', prioridad: 'Alta', estado: 'En Progreso' },
  { id: 2, nombre: 'Auditoría de Seguridad Q3', prioridad: 'Media', estado: 'Pendiente' },
  { id: 3, nombre: 'Rediseño Interfaz de Usuario', prioridad: 'Baja', estado: 'Completado' },
  { id: 4, nombre: 'Optimización de Base de Datos', prioridad: 'Alta', estado: 'En Progreso' },
  { id: 5, nombre: 'Implementación de Microservicios', prioridad: 'Media', estado: 'En Revisión' },
];
