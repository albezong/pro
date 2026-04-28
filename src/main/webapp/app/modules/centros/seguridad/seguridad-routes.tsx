import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PermissionGuard from 'app/shared/auth/permission-guard';
import { useAppSelector } from 'app/config/store';
import { usePermission } from 'app/shared/auth/use-permission';

import Modules from './modulos/modules';
import ModulesCenter from './modulos/modules-center';
import ModulesCreate from './modulos/modules-create';
import ModulesDelete from './modulos/modules-delete';
import ModulesDetail from './modulos/modules-detail';
import ModulesUpdate from './modulos/modules-update';

import Profiles from './perfil/perfil';
import ProfilesCenter from './perfil/perfil-center';
import ProfilesCreate from './perfil/perfil-create';
import ProfilesDelete from './perfil/perfil-delete';
import ProfilesDetail from './perfil/perfil-detail';
import ProfilesUpdate from './perfil/perfil-update';

import ProfilePermissions from './permisos-perfil/profile-permissions';
import ProfilePermissionsCenter from './permisos-perfil/profile-permissions-center';
import ProfilePermissionsCreate from './permisos-perfil/profile-permissions-create';
import ProfilePermissionsDelete from './permisos-perfil/profile-permissions-delete';
import ProfilePermissionsDetail from './permisos-perfil/profile-permissions-detail';
import ProfilePermissionsUpdate from './permisos-perfil/profile-permissions-update';
import ProfilePermissionsMatrix from './permisos-perfil/profile-permissions-matrix';

import Usuarios from './usuarios/usuarios';
import UsuariosCenter from './usuarios/usuarios-center';
import UsuariosCreate from './usuarios/usuarios-create';
import UsuariosDelete from './usuarios/usuarios-delete';
import UsuariosDetail from './usuarios/usuarios-detail';
import UsuariosUpdate from './usuarios/usuarios-update';

/**
 * Index inteligente para /seguridad.
 *
 * Ya NO usa ROLE_ADMIN de JHipster como bypass.
 * Redirige según permisos de BD (isSuperAdmin o canView por módulo).
 */
const SeguridadIndex = () => {
  const loaded = useAppSelector(s => s.permission?.loaded);
  const isSuperAdmin = useAppSelector(s => s.permission?.permissions?.isSuperAdmin || s.permission?.permissions?.isAdmin);
  const usuarios = usePermission('Usuarios');
  const perfil = usePermission('Perfil');
  const modulos = usePermission('Modulos');
  const permisos = usePermission('Permisos');

  if (!loaded) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando permisos...</span>
        </div>
      </div>
    );
  }

  // SuperAdmin de BD → acceso total
  if (isSuperAdmin) return <Navigate to="usuarios-center" replace />;
  if (usuarios.canView) return <Navigate to="usuarios-center" replace />;
  if (perfil.canView) return <Navigate to="profiles-center" replace />;
  if (modulos.canView) return <Navigate to="modules-center" replace />;
  if (permisos.canView) return <Navigate to="profile-permissions-center" replace />;

  return <Navigate to="/404" replace />;
};

export default () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SeguridadIndex />} />

    <Route
      path="modulos"
      element={
        <PermissionGuard moduleName="Modulos" redirect>
          <Modules />
        </PermissionGuard>
      }
    />
    <Route
      path="modules-center"
      element={
        <PermissionGuard moduleName="Modulos" redirect>
          <ModulesCenter />
        </PermissionGuard>
      }
    />
    <Route
      path="modules-create"
      element={
        <PermissionGuard moduleName="Modulos" requiredAction="canCreate" redirect>
          <ModulesCreate />
        </PermissionGuard>
      }
    />
    <Route
      path="modules-delete/:id"
      element={
        <PermissionGuard moduleName="Modulos" requiredAction="canDelete" redirect>
          <ModulesDelete />
        </PermissionGuard>
      }
    />
    <Route
      path="modules-detail/:id"
      element={
        <PermissionGuard moduleName="Modulos" redirect>
          <ModulesDetail />
        </PermissionGuard>
      }
    />
    <Route
      path="modules-update/:id"
      element={
        <PermissionGuard moduleName="Modulos" requiredAction="canEdit" redirect>
          <ModulesUpdate />
        </PermissionGuard>
      }
    />

    <Route
      path="profiles"
      element={
        <PermissionGuard moduleName="Perfil" redirect>
          <Profiles />
        </PermissionGuard>
      }
    />
    <Route
      path="profiles-center"
      element={
        <PermissionGuard moduleName="Perfil" redirect>
          <ProfilesCenter />
        </PermissionGuard>
      }
    />
    <Route
      path="profiles-create"
      element={
        <PermissionGuard moduleName="Perfil" requiredAction="canCreate" redirect>
          <ProfilesCreate />
        </PermissionGuard>
      }
    />
    <Route
      path="profiles-delete/:id"
      element={
        <PermissionGuard moduleName="Perfil" requiredAction="canDelete" redirect>
          <ProfilesDelete />
        </PermissionGuard>
      }
    />
    <Route
      path="profiles-detail/:id"
      element={
        <PermissionGuard moduleName="Perfil" redirect>
          <ProfilesDetail />
        </PermissionGuard>
      }
    />
    <Route
      path="profiles-update/:id"
      element={
        <PermissionGuard moduleName="Perfil" requiredAction="canEdit" redirect>
          <ProfilesUpdate />
        </PermissionGuard>
      }
    />

    <Route
      path="profile-permissions"
      element={
        <PermissionGuard moduleName="Permisos" redirect>
          <ProfilePermissions />
        </PermissionGuard>
      }
    />
    <Route
      path="profile-permissions-center"
      element={
        <PermissionGuard moduleName="Permisos" redirect>
          <ProfilePermissionsCenter />
        </PermissionGuard>
      }
    />
    <Route
      path="profile-permissions-create"
      element={
        <PermissionGuard moduleName="Permisos" requiredAction="canCreate" redirect>
          <ProfilePermissionsCreate />
        </PermissionGuard>
      }
    />
    <Route
      path="profile-permissions-delete/:id"
      element={
        <PermissionGuard moduleName="Permisos" requiredAction="canDelete" redirect>
          <ProfilePermissionsDelete />
        </PermissionGuard>
      }
    />
    <Route
      path="profile-permissions-detail/:id"
      element={
        <PermissionGuard moduleName="Permisos" redirect>
          <ProfilePermissionsDetail />
        </PermissionGuard>
      }
    />
    <Route
      path="profile-permissions-update/:id"
      element={
        <PermissionGuard moduleName="Permisos" requiredAction="canEdit" redirect>
          <ProfilePermissionsUpdate />
        </PermissionGuard>
      }
    />
    <Route
      path="profile-permissions-matrix"
      element={
        <PermissionGuard moduleName="Permisos" redirect>
          <ProfilePermissionsMatrix />
        </PermissionGuard>
      }
    />

    <Route
      path="usuarios"
      element={
        <PermissionGuard moduleName="Usuarios" redirect>
          <Usuarios />
        </PermissionGuard>
      }
    />
    <Route
      path="usuarios-center"
      element={
        <PermissionGuard moduleName="Usuarios" redirect>
          <UsuariosCenter />
        </PermissionGuard>
      }
    />
    <Route
      path="usuarios-create"
      element={
        <PermissionGuard moduleName="Usuarios" requiredAction="canCreate" redirect>
          <UsuariosCreate />
        </PermissionGuard>
      }
    />
    <Route
      path="usuarios-delete/:login"
      element={
        <PermissionGuard moduleName="Usuarios" requiredAction="canDelete" redirect>
          <UsuariosDelete />
        </PermissionGuard>
      }
    />
    <Route
      path="usuarios-detail/:login"
      element={
        <PermissionGuard moduleName="Usuarios" redirect>
          <UsuariosDetail />
        </PermissionGuard>
      }
    />
    <Route
      path="usuarios-update/:login"
      element={
        <PermissionGuard moduleName="Usuarios" requiredAction="canEdit" redirect>
          <UsuariosUpdate />
        </PermissionGuard>
      }
    />
  </ErrorBoundaryRoutes>
);
