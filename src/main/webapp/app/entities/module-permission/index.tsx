import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import ModulePermission from './module-permission';
import ModulePermissionDetail from './module-permission-detail';
import ModulePermissionUpdate from './module-permission-update';
import ModulePermissionDeleteDialog from './module-permission-delete-dialog';

const ModulePermissionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ModulePermission />} />
    <Route path="new" element={<ModulePermissionUpdate />} />
    <Route path=":id">
      <Route index element={<ModulePermissionDetail />} />
      <Route path="edit" element={<ModulePermissionUpdate />} />
      <Route path="delete" element={<ModulePermissionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ModulePermissionRoutes;
