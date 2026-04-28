import { IUser } from 'app/shared/model/user.model';

export interface IProfile {
  id?: number;
  name?: string;
  description?: string | null;
  active?: boolean | null;
  isSuperAdmin?: boolean | null;
  users?: IUser[] | null;
}

export const defaultValue: Readonly<IProfile> = {
  active: false,
  isSuperAdmin: false,
};
