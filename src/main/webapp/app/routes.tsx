import React from 'react';
import { Route } from 'react-router';

import Loadable from 'react-loadable';

import Login from 'app/modules/login/login';
import Logout from 'app/modules/login/logout';
import Home from 'app/modules/home/home';
import EntitiesRoutes from 'app/entities/routes';
import PrivateRoute from 'app/shared/auth/private-route';
import PermissionGuard from 'app/shared/auth/permission-guard';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import PageNotFound from 'app/shared/error/page-not-found';
import { AUTHORITIES } from 'app/config/constants';

import RHRoutes from 'app/modules/centros/recursos-humanos/rh-routes';
import SeguridadRoutes from 'app/modules/centros/seguridad/seguridad-routes';
import VentasRoutes from 'app/modules/centros/ventas/ventas-routes';
import Principal1Routes from 'app/modules/centros/principal-1/principal-1-routes';
import Principal2Routes from 'app/modules/centros/principal-2/principal-2-routes';

const loading = <div>loading ...</div>;

const Account = Loadable({
  loader: () => import(/* webpackChunkName: "account" */ 'app/modules/account'),
  loading: () => loading,
});

const Admin = Loadable({
  loader: () => import(/* webpackChunkName: "administration" */ 'app/modules/administration'),
  loading: () => loading,
});

/**
 * MAPA DE RUTAS
 *
 * moduleName como array = OR: el guard pasa si el usuario tiene canView
 * en AL MENOS UNO de los módulos listados.
 * Los guards finos (por sub-ruta) están dentro de cada *-routes.tsx.
 */
const MODULOS_ROUTES = [
  {
    path: 'seguridad/*',
    element: <SeguridadRoutes />,
    autoridad: AUTHORITIES.USER,
    moduleName: ['Seguridad', 'Usuarios', 'Perfil', 'Modulos', 'Permisos'] as string[],
  },
  {
    path: 'rh/*',
    element: <RHRoutes />,
    autoridad: AUTHORITIES.USER,
    moduleName: 'RecursosHumanos',
  },
  {
    path: 'ventas/*',
    element: <VentasRoutes />,
    autoridad: AUTHORITIES.USER,
    moduleName: 'Ventas',
  },
  {
    path: 'principal-1-routes/*',
    element: <Principal1Routes />,
    autoridad: AUTHORITIES.USER,
    moduleName: ['Principal1-1', 'Principal1-2'] as string[],
  },
  {
    path: 'principal-2-routes/*',
    element: <Principal2Routes />,
    autoridad: AUTHORITIES.USER,
    moduleName: ['Principal2-1', 'Principal2-2'] as string[],
  },
];

const AppRoutes = () => (
  <div className="view-routes">
    <ErrorBoundaryRoutes>
      <Route index element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="logout" element={<Logout />} />

      {MODULOS_ROUTES.map(route => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRoute hasAnyAuthorities={[route.autoridad]}>
              <PermissionGuard moduleName={route.moduleName} redirect>
                {route.element}
              </PermissionGuard>
            </PrivateRoute>
          }
        />
      ))}

      <Route path="account">
        <Route
          path="*"
          element={
            <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN, AUTHORITIES.USER]}>
              <Account />
            </PrivateRoute>
          }
        />
      </Route>

      <Route
        path="admin/*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.ADMIN]}>
            <Admin />
          </PrivateRoute>
        }
      />

      {/* /404 explícito — DEBE ir ANTES del wildcard path="*" */}
      <Route path="404" element={<PageNotFound />} />

      <Route
        path="*"
        element={
          <PrivateRoute hasAnyAuthorities={[AUTHORITIES.USER]}>
            <EntitiesRoutes />
          </PrivateRoute>
        }
      />

      <Route path="*" element={<PageNotFound />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default AppRoutes;
