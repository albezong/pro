import { IModules } from 'app/shared/model/modules.model';
import { IProfile } from 'app/shared/model/profile.model';

export interface IModulePermission {
  id?: number;
  canCreate?: boolean | null;
  canEdit?: boolean | null;
  canDelete?: boolean | null;
  canView?: boolean | null;
  canHistory?: boolean | null;
  module?: IModules | null;
  profile?: IProfile | null;
}

export const defaultValue: Readonly<IModulePermission> = {
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canView: false,
  canHistory: false,
};
