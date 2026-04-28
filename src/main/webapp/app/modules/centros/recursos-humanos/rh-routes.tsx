import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import RH1_1 from './rh1-1';
import RH1_2 from './rh1-2';
import RH1_3 from './rh1-3';

export default () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Navigate to="rh1-1" replace />} />
    <Route path="rh1-1" element={<RH1_1 />} />
    <Route path="rh1-2" element={<RH1_2 />} />
    <Route path="rh1-3" element={<RH1_3 />} />
  </ErrorBoundaryRoutes>
);
