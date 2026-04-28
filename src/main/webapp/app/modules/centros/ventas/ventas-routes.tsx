import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

// Importa tus componentes de ventas
import Ventas1_1 from './ventas1-1';
import Ventas1_2 from './ventas1-2';
import Ventas1_3 from './ventas1-3';

export default () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Navigate to="ventas1-1" replace />} />
    <Route path="ventas1-1" element={<Ventas1_1 />} />
    <Route path="ventas1-2" element={<Ventas1_2 />} />
    <Route path="ventas1-3" element={<Ventas1_3 />} />
  </ErrorBoundaryRoutes>
);
