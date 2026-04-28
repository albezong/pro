import dayjs from 'dayjs';

export interface IModules {
  id?: number;
  nombre?: string;
  fechaCreacion?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<IModules> = {};
