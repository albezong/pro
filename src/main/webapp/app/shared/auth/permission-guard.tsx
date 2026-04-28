import React from 'react';
import { Navigate } from 'react-router-dom';
import { ModuleAccess } from 'app/shared/reducers/permission';
import { useAppSelector } from 'app/config/store';

interface PermissionGuardProps {
  moduleName: string | string[];
  requiredAction?: keyof ModuleAccess;
  children: React.ReactNode;
  redirect?: boolean;
}

const Spinner = ({ label }: { label: string }) => (
  <div className="d-flex justify-content-center align-items-center mt-5">
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">{label}</span>
    </div>
  </div>
);

/**
 * Guard de permisos de módulo.
 *
 * IMPORTANTE: ROLE_ADMIN de JHipster NO bypass este guard.
 * El acceso se determina SIEMPRE por la tabla module_permission en BD.
 * Solo isSuperAdmin=true en el perfil asignado da acceso total.
 *
 * Flujo:
 * 1. Espera sesión (sessionHasBeenFetched)
 * 2. Espera permisos (loaded=true) — nunca redirige antes
 * 3. Si el perfil es isSuperAdmin o isAdmin (flag de BD) → pasa
 * 4. Si tiene el permiso requerido en el módulo → pasa
 * 5. Si no → redirect a /404 o mensaje inline
 */
const PermissionGuard = ({ moduleName, requiredAction, children, redirect = false }: PermissionGuardProps) => {
  const sessionFetched = useAppSelector(s => s.authentication.sessionHasBeenFetched);
  const isAuthenticated = useAppSelector(s => s.authentication.isAuthenticated);
  const loaded = useAppSelector(s => s.permission?.loaded);
  const perms = useAppSelector(s => s.permission?.permissions);

  if (!sessionFetched) return <Spinner label="Cargando sesión..." />;
  if (!isAuthenticated) return null;
  if (!loaded) return <Spinner label="Cargando permisos..." />;

  // SuperAdmin de BD (perfil marcado como isSuperAdmin) → acceso total
  if (perms?.isAdmin || perms?.isSuperAdmin) return <>{children}</>;

  const names = Array.isArray(moduleName) ? moduleName : [moduleName];

  const hasAccess = names.some(name => {
    const m = perms?.modules?.[name];
    if (!m) return false;

    if (requiredAction && requiredAction !== 'canView') {
      return !!m[requiredAction];
    }

    // Sin requiredAction o canView → acceso si tiene cualquier permiso activo
    return !!(m.canView || m.canCreate || m.canEdit || m.canDelete || m.canHistory);
  });

  if (!hasAccess) {
    return redirect ? (
      <Navigate to="/404" replace />
    ) : (
      <div className="alert alert-danger mt-3">No tienes permiso para acceder a este módulo.</div>
    );
  }

  return <>{children}</>;
};

export default PermissionGuard;
