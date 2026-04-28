// principal-1-2-center.ts

export interface IPrincipal12 {
  id: number;
  recurso: string;
  responsable: string;
  carga: number;
  descripcion?: string;
}

export const INITIAL_DATA_12: IPrincipal12[] = [
  {
    id: 201,
    recurso: 'Servidor Central API',
    responsable: 'Admin_Juan',
    carga: 65,
    descripcion: 'Servidor principal que aloja los servicios REST para la plataforma.',
  },
  {
    id: 202,
    recurso: 'Base de Datos Producción',
    responsable: 'DBA_Elena',
    carga: 80,
    descripcion: 'Instancia principal de PostgreSQL para el almacenamiento de datos transaccionales.',
  },
  {
    id: 203,
    recurso: 'Nodo de Balanceo 01',
    responsable: 'Sys_Roberto',
    carga: 30,
    descripcion: 'Distribuidor de carga NGINX para la zona de disponibilidad A.',
  },
  {
    id: 204,
    recurso: 'Almacenamiento Cloud',
    responsable: 'Cloud_Dev',
    carga: 45,
    descripcion: 'Bucket S3 para el almacenamiento de archivos multimedia y respaldos.',
  },
  {
    id: 205,
    recurso: 'Gateway de Seguridad',
    responsable: 'Sec_Marta',
    carga: 95,
    descripcion: 'Firewall de aplicación y sistema de detección de intrusos.',
  },
];
