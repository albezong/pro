import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PermissionGuard from 'app/shared/auth/permission-guard';
import { useAppSelector } from 'app/config/store';
import { usePermission } from 'app/shared/auth/use-permission';

import Principal21Center from './principal-2-1/principal-2-1-center';
import Principal21Create from './principal-2-1/principal-2-1-create';
import Principal21Delete from './principal-2-1/principal-2-1-delete';
import Principal21Detail from './principal-2-1/principal-2-1-detail';
import Principal21Update from './principal-2-1/principal-2-1-update';

import Principal22Center from './principal-2-2/principal-2-2-center';
import Principal22Create from './principal-2-2/principal-2-2-create';
import Principal22Delete from './principal-2-2/principal-2-2-delete';
import Principal22Detail from './principal-2-2/principal-2-2-detail';
import Principal22Update from './principal-2-2/principal-2-2-update';

const Principal2Index = () => {
  const isAdmin = useAppSelector(s => (s.authentication.account?.authorities ?? []).includes('ROLE_ADMIN'));
  const loaded = useAppSelector(s => s.permission?.loaded);
  const p21 = usePermission('Principal2-1');
  const p22 = usePermission('Principal2-2');

  if (isAdmin) return <Navigate to="principal-2-1-center" replace />;

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
    <Route index element={<Principal2Index />} />

    <Route
      path="principal-2-1-center"
      element={
        <PermissionGuard moduleName="Principal2-1" redirect>
          <Principal21Center />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-1-create"
      element={
        <PermissionGuard moduleName="Principal2-1" requiredAction="canCreate" redirect>
          <Principal21Create />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-1-delete/:id"
      element={
        <PermissionGuard moduleName="Principal2-1" requiredAction="canDelete" redirect>
          <Principal21Delete />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-1-detail/:id"
      element={
        <PermissionGuard moduleName="Principal2-1" requiredAction="canView" redirect>
          <Principal21Detail />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-1-update/:id"
      element={
        <PermissionGuard moduleName="Principal2-1" requiredAction="canEdit" redirect>
          <Principal21Update />
        </PermissionGuard>
      }
    />

    <Route
      path="principal-2-2-center"
      element={
        <PermissionGuard moduleName="Principal2-2" redirect>
          <Principal22Center />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-2-create"
      element={
        <PermissionGuard moduleName="Principal2-2" requiredAction="canCreate" redirect>
          <Principal22Create />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-2-delete/:id"
      element={
        <PermissionGuard moduleName="Principal2-2" requiredAction="canDelete" redirect>
          <Principal22Delete />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-2-detail/:id"
      element={
        <PermissionGuard moduleName="Principal2-2" requiredAction="canView" redirect>
          <Principal22Detail />
        </PermissionGuard>
      }
    />
    <Route
      path="principal-2-2-update/:id"
      element={
        <PermissionGuard moduleName="Principal2-2" requiredAction="canEdit" redirect>
          <Principal22Update />
        </PermissionGuard>
      }
    />
  </ErrorBoundaryRoutes>
);
