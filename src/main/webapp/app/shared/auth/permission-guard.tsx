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
 * ROLE_ADMIN de JHipster NO bypasea este guard.
 * El acceso lo determina SIEMPRE el perfil en BD (module_permission).
 * Solo isSuperAdmin=true (flag en perfil) da acceso total.
 *
 * Nunca hace Navigate mientras loaded=false — muestra spinner.
 */
const PermissionGuard = ({ moduleName, requiredAction, children, redirect = false }: PermissionGuardProps) => {
  const sessionFetched = useAppSelector(s => s.authentication.sessionHasBeenFetched);
  const isAuthenticated = useAppSelector(s => s.authentication.isAuthenticated);
  const loaded = useAppSelector(s => s.permission?.loaded);
  const perms = useAppSelector(s => s.permission?.permissions);

  if (!sessionFetched) return <Spinner label="Cargando sesión..." />;
  if (!isAuthenticated) return null;
  if (!loaded) return <Spinner label="Cargando permisos..." />;

  // isSuperAdmin del perfil en BD → acceso total
  if (perms?.isAdmin || perms?.isSuperAdmin) return <>{children}</>;

  const names = Array.isArray(moduleName) ? moduleName : [moduleName];

  const hasAccess = names.some(name => {
    const m = perms?.modules?.[name];
    if (!m) return false;

    if (requiredAction && requiredAction !== 'canView') {
      return !!m[requiredAction];
    }

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
