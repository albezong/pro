export interface IPrincipal22Task {
  id: number;
  tarea: string;
  responsable: string;
  tiempo: string;
  categoria: string;
  descripcion?: string; // Opcional para la vista de detalle
}

export const INITIAL_TASKS: IPrincipal22Task[] = [
  { id: 1, tarea: 'Configuración de SSL', responsable: 'Carlos M.', tiempo: '4h', categoria: 'Seguridad' },
  { id: 2, tarea: 'Diseño de Mockups', responsable: 'Ana R.', tiempo: '12h', categoria: 'Diseño' },
  { id: 3, tarea: 'Optimización de Queries', responsable: 'Juan P.', tiempo: '6h', categoria: 'DBA' },
  { id: 4, tarea: 'Pruebas Unitarias', responsable: 'Laura G.', tiempo: '8h', categoria: 'QA' },
  { id: 5, tarea: 'Despliegue a Staging', responsable: 'Roberto V.', tiempo: '2h', categoria: 'DevOps' },
];
