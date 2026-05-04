import { useAppSelector } from 'app/config/store';
import { ModuleAccess } from 'app/shared/reducers/permission';

const NO_ACCESS: ModuleAccess = {
  canView: false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
};

/**
 * Hook que devuelve los permisos del módulo indicado para el usuario actual.
 *
 * IMPORTANTE: ROLE_ADMIN de JHipster NO da acceso automático.
 * El acceso lo determina SIEMPRE el perfil en BD.
 * Solo isSuperAdmin=true en el perfil devuelve acceso total a todos los módulos.
 *
 * Flujo:
 * 1. Sin autenticación → NO_ACCESS
 * 2. Permisos no cargados aún → NO_ACCESS (el guard mostrará spinner)
 * 3. isSuperAdmin o isAdmin de BD → FULL_ACCESS
 * 4. Evalúa módulo en el mapa de permisos
 */
export const usePermission = (moduleName: string): ModuleAccess => {
  const perms = useAppSelector(state => state.permission?.permissions);
  const isAuthenticated = useAppSelector(state => state.authentication.isAuthenticated);
  const loaded = useAppSelector(state => state.permission?.loaded);

  if (!isAuthenticated) return NO_ACCESS;
  // Mientras no carguen los permisos de BD, devolver NO_ACCESS
  // El PermissionGuard mostrará spinner hasta que loaded=true
  if (!loaded || !perms) return NO_ACCESS;

  // isSuperAdmin del perfil en BD → acceso total
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
