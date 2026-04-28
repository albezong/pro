import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { ModuleAccess } from 'app/shared/reducers/permission';

const FULL_ACCESS: ModuleAccess = {
  canView: true,
  canCreate: true,
  canEdit: true,
  canDelete: true,
};
const NO_ACCESS: ModuleAccess = {
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
};

export const usePermission = (moduleName: string): ModuleAccess => {
  const perms = useAppSelector(state => state.permission?.permissions);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const authorities = useAppSelector(state => state.authentication.account?.authorities ?? []);
  const isAdmin = hasAnyAuthority(authorities, [AUTHORITIES.ADMIN]);

  if (!isAuthenticated) return NO_ACCESS;
  if (isAdmin) return FULL_ACCESS;
  if (!perms) return NO_ACCESS;
  if (perms.isAdmin || perms.isSuperAdmin) return FULL_ACCESS;

  const m = perms.modules?.[moduleName];
  if (!m) return NO_ACCESS;

  // Regla: si tiene canCreate, canEdit, canDelete o canHistory activo
  // el módulo es visible automáticamente (canView implícito).
  const hasAnyAction = m.canCreate || m.canEdit || m.canDelete || m.canView;

  return {
    canView: m.canView,
    canCreate: m.canCreate,
    canEdit: m.canEdit,
    canDelete: m.canDelete,
  };
};

export const useHasPermission = (moduleName: string, action: keyof ModuleAccess): boolean => {
  return usePermission(moduleName)[action] === true;
};
