import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

// Importa tus componentes de Rod
import Rod1_1 from './produccion1-1';
import Rod1_2 from './produccion1-2';
import Rod1_3 from './produccion1-3';

export default () => (
  <ErrorBoundaryRoutes>
    <Route path="rod1-1" element={<Rod1_1 />} />
    <Route path="rod1-2" element={<Rod1_2 />} />
    <Route path="rod1-3" element={<Rod1_3 />} />
  </ErrorBoundaryRoutes>
);
