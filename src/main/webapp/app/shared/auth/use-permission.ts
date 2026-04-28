// use-permission.ts

import { useAppSelector } from 'app/config/store';
import { ModuleAccess } from 'app/shared/reducers/permission';

const NO_ACCESS: ModuleAccess = {
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
};

export const usePermission = (moduleName: string): ModuleAccess => {
  const perms = useAppSelector(state => state.permission?.permissions);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loaded = useAppSelector(state => state.permission?.loaded);

  if (!isAuthenticated) return NO_ACCESS;
  if (!loaded || !perms) return NO_ACCESS;

  // ✅ SOLO isSuperAdmin de BD da acceso total a módulos
  // ❌ isAdmin (ROLE_ADMIN de JHipster) ya NO bypasea — solo sirve para /api/admin/**
  if (perms.isSuperAdmin) {
    return { canView: true, canCreate: true, canEdit: true, canDelete: true };
  }

  const m = perms.modules?.[moduleName];
  if (!m) return NO_ACCESS;

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
