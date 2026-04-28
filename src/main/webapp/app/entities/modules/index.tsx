import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Modules from './modules';
import ModulesDetail from './modules-detail';
import ModulesUpdate from './modules-update';
import ModulesDeleteDialog from './modules-delete-dialog';

const ModulesRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Modules />} />
    <Route path="new" element={<ModulesUpdate />} />
    <Route path=":id">
      <Route index element={<ModulesDetail />} />
      <Route path="edit" element={<ModulesUpdate />} />
      <Route path="delete" element={<ModulesDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default ModulesRoutes;
