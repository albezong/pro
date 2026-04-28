import React from 'react';
import { Navigate } from 'react-router-dom';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
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
 * Renderiza los hijos solo si el usuario tiene AL MENOS UN permiso
 * (canCreate, canEdit, canDelete o canHistory) en alguno de los módulos indicados.
 * canView ya no se evalúa.
 */
const PermissionGuard = ({ moduleName, requiredAction, children, redirect = false }: PermissionGuardProps) => {
  const authorities = useAppSelector(s => s.authentication.account?.authorities ?? []);
  const isAdmin = hasAnyAuthority(authorities, [AUTHORITIES.ADMIN]);
  const sessionFetched = useAppSelector(s => s.authentication.sessionHasBeenFetched);
  const isAuthenticated = useAppSelector(s => s.authentication.isAuthenticated);
  const loaded = useAppSelector(s => s.permission?.loaded);
  const perms = useAppSelector(s => s.permission?.permissions);

  if (isAdmin) return <>{children}</>;
  if (!sessionFetched) return <Spinner label="Cargando sesión..." />;
  if (!isAuthenticated) return null;
  if (!loaded) return <Spinner label="Cargando permisos..." />;
  if (perms?.isAdmin || perms?.isSuperAdmin) return <>{children}</>;

  const names = Array.isArray(moduleName) ? moduleName : [moduleName];
  const hasAccess = names.some(name => {
    const m = perms?.modules?.[name];
    if (!m) return false;

    // Si se pide una acción específica (canCreate, canEdit, etc.), evalúa solo esa
    if (requiredAction && requiredAction !== 'canView') {
      return !!m[requiredAction];
    }

    // Por defecto: acceso si tiene cualquier permiso activo (sin canView)
    return !!(m.canCreate || m.canEdit || m.canDelete || m.canHistory);
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
