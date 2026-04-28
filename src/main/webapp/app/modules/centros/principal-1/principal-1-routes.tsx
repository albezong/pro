import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PermissionGuard from 'app/shared/auth/permission-guard';
import { useAppSelector } from 'app/config/store';
import { usePermission } from 'app/shared/auth/use-permission';

import Principal11Center from './principal-1-1/principal-1-1-center';
import Principal11Create from './principal-1-1/principal-1-1-create';
import Principal11Delete from './principal-1-1/principal-1-1-delete';
import Principal11Detail from './principal-1-1/principal-1-1-detail';
import Principal11Update from './principal-1-1/principal-1-1-update';

import Principal12Center from './principal-1-2/principal-1-2-center';
import Principal12Create from './principal-1-2/principal-1-2-create';
import Principal12Delete from './principal-1-2/principal-1-2-delete';
import Principal12Detail from './principal-1-2/principal-1-2-detail';
import Principal12Update from './principal-1-2/principal-1-2-update';

const Principal1Index = () => {
  const isAdmin = useAppSelector(s => (s.authentication.account?.authorities ?? []).includes('ROLE_ADMIN'));
  const loaded = useAppSelector(s => s.permission?.loaded);
  const p11 = usePermission('Principal1-1');
  const p12 = usePermission('Principal1-2');

  if (isAdmin) return <Navigate to="principal-1-1-center" replace />;

  if (!loaded) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando permisos...</span>
        </div>
      </div>
    );
  }

  return <Navigate to="/404" replace />;
};

export default () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Principal1Index />} />

    <Route
      path="principal-1-1-center"
      element={
        <PermissionGuard moduleName="Principal1-1" redirect>
          <Principal11Center />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-1-create"
      element={
        <PermissionGuard moduleName="Principal1-1" requiredAction="canCreate" redirect>
          <Principal11Create />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-1-delete/:id"
      element={
        <PermissionGuard moduleName="Principal1-1" requiredAction="canDelete" redirect>
          <Principal11Delete />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-1-detail/:id"
      element={
        <PermissionGuard moduleName="Principal1-1" requiredAction="canView" redirect>
          <Principal11Detail />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-1-update/:id"
      element={
        <PermissionGuard moduleName="Principal1-1" requiredAction="canEdit" redirect>
          <Principal11Update />
        </PermissionGuard>
      }
    />

    <Route
      path="principal-1-2-center"
      element={
        <PermissionGuard moduleName="Principal1-2" redirect>
          <Principal12Center />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-2-create"
      element={
        <PermissionGuard moduleName="Principal1-2" requiredAction="canCreate" redirect>
          <Principal12Create />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-2-delete/:id"
      element={
        <PermissionGuard moduleName="Principal1-2" requiredAction="canDelete" redirect>
          <Principal12Delete />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-2-detail/:id"
      element={
        <PermissionGuard moduleName="Principal1-2" requiredAction="canView" redirect>
          <Principal12Detail />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-1-2-update/:id"
      element={
        <PermissionGuard moduleName="Principal1-2" requiredAction="canEdit" redirect>
          <Principal12Update />
        </PermissionGuard>
      }
    />
  </ErrorBoundaryRoutes>
);
