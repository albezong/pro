import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PermissionGuard from 'app/shared/auth/permission-guard';

import Profile from './profile';
import ModulePermission from './module-permission';
import Modules from './modules';
/* jhipster-needle-add-route-import - JHipster will add routes here */

/**
 * Entity routes protegidas con PermissionGuard.
 * Módulos: "Perfil", "Permisos", "Modulos" — deben existir en BD (seed_modules.xml).
 */
export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        <Route
          path="profile/*"
          element={
            <PermissionGuard moduleName="Perfil" requiredAction="canView" redirect>
              <Profile />
            </PermissionGuard>
          }
        />
        <Route
          path="module-permission/*"
          element={
            <PermissionGuard moduleName="Permisos" requiredAction="canView" redirect>
              <ModulePermission />
            </PermissionGuard>
          }
        />
        <Route
          path="modules/*"
          element={
            <PermissionGuard moduleName="Modulos" requiredAction="canView" redirect>
              <Modules />
            </PermissionGuard>
          }
        />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
