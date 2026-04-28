// principal-1-1-center.ts

export interface IPrincipal11 {
  id: number;
  codigo: string;
  version: string;
  fechaRevision: string;
  descripcion?: string;
}

export const INITIAL_DATA: IPrincipal11[] = [
  {
    id: 101,
    codigo: 'COMP-Alpha',
    version: '1.0.2',
    fechaRevision: '2024-03-15',
    descripcion: 'Componente de núcleo para el procesamiento de datos en la capa principal 1.1.',
  },
  {
    id: 102,
    codigo: 'COMP-Beta',
    version: '2.1.0',
    fechaRevision: '2024-03-20',
    descripcion: 'Módulo de comunicación de alta prioridad para servicios externos.',
  },
  {
    id: 103,
    codigo: 'COMP-Gamma',
    version: '0.8.5',
    fechaRevision: '2024-04-01',
    descripcion: 'Controlador de interfaz de usuario para la sección de seguridad.',
  },
  {
    id: 104,
    codigo: 'COMP-Delta',
    version: '3.0.0',
    fechaRevision: '2024-04-10',
    descripcion: 'Motor de renderizado optimizado para visualizaciones 3D.',
  },
  {
    id: 105,
    codigo: 'COMP-Epsilon',
    version: '1.2.4',
    fechaRevision: '2024-04-22',
    descripcion: 'Librería de utilidades para el manejo de fechas y formatos.',
  },
];
