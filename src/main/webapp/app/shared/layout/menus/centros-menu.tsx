import React from 'react';
import { NavDropdown } from './menu-components';
import MenuItem from './menu-item';
import { useAppSelector } from 'app/config/store';
import { usePermission } from 'app/shared/auth/use-permission';

/**
 * Menú de centros.
 *
 * Visibilidad controlada SOLO por permisos de BD (module_permission).
 * ROLE_ADMIN de JHipster NO bypasea — lo que manda es isSuperAdmin del perfil.
 * El hook usePermission ya detecta isSuperAdmin y devuelve canView=true en todo.
 */
const CentrosMenu = () => {
  const isAuthenticated = useAppSelector(s => s.authentication.isAuthenticated);
  const loaded = useAppSelector(s => s.permission?.loaded);
  const isSuperAdmin = useAppSelector(s => s.permission?.permissions?.isSuperAdmin || s.permission?.permissions?.isAdmin);

  const usuarios = usePermission('Usuarios');
  const perfil = usePermission('Perfil');
  const modulos = usePermission('Modulos');
  const permisos = usePermission('Permisos');
  const p11 = usePermission('Principal1-1');
  const p12 = usePermission('Principal1-2');
  const p21 = usePermission('Principal2-1');
  const p22 = usePermission('Principal2-2');
  const rh = usePermission('RecursosHumanos');
  const ventas = usePermission('Ventas');

  if (!isAuthenticated) return null;
  if (!loaded) return null;

  const hasPerm = (p: ReturnType<typeof usePermission>) => p.canView || p.canCreate || p.canEdit || p.canDelete;

  const verSeguridad = isSuperAdmin || hasPerm(usuarios) || hasPerm(perfil) || hasPerm(modulos) || hasPerm(permisos);
  const verPrincipal1 = isSuperAdmin || hasPerm(p11) || hasPerm(p12);
  const verPrincipal2 = isSuperAdmin || hasPerm(p21) || hasPerm(p22);

  return (
    <>
      {verSeguridad && (
        <NavDropdown icon="shield-alt" name="Seguridad" id="seguridad-menu" data-cy="seguridadMenu">
          {(isSuperAdmin || hasPerm(usuarios)) && (
            <MenuItem icon="user" to="/seguridad/usuarios-center" data-cy="usuarios">
              Usuarios
            </MenuItem>
          )}
          {(isSuperAdmin || hasPerm(perfil)) && (
            <MenuItem icon="lock" to="/seguridad/profiles-center" data-cy="perfil">
              Perfiles
            </MenuItem>
          )}
          {(isSuperAdmin || hasPerm(modulos)) && (
            <MenuItem icon="th-list" to="/seguridad/modules-center" data-cy="modulos">
              Módulos
            </MenuItem>
          )}
          {(isSuperAdmin || hasPerm(permisos)) && (
            <MenuItem icon="tasks" to="/seguridad/profile-permissions-matrix" data-cy="permisos">
              Matriz de Permisos
            </MenuItem>
          )}
        </NavDropdown>
      )}

      {verPrincipal1 && (
        <NavDropdown icon="star" name="Principal 1" id="principal1-menu" data-cy="principal1Menu">
          {(isSuperAdmin || hasPerm(p11)) && (
            <MenuItem icon="list" to="/principal-1-routes/principal-1-1-center" data-cy="principal11">
              Principal 1.1
            </MenuItem>
          )}
          {(isSuperAdmin || hasPerm(p12)) && (
            <MenuItem icon="list" to="/principal-1-routes/principal-1-2-center" data-cy="principal12">
              Principal 1.2
            </MenuItem>
          )}
        </NavDropdown>
      )}

      {verPrincipal2 && (
        <NavDropdown icon="building" name="Principal 2" id="principal2-menu" data-cy="principal2Menu">
          {(isSuperAdmin || hasPerm(p21)) && (
            <MenuItem icon="list" to="/principal-2-routes/principal-2-1-center" data-cy="principal21">
              Principal 2.1
            </MenuItem>
          )}
          {(isSuperAdmin || hasPerm(p22)) && (
            <MenuItem icon="list" to="/principal-2-routes/principal-2-2-center" data-cy="principal22">
              Planificación de Tareas
            </MenuItem>
          )}
        </NavDropdown>
      )}

      {(isSuperAdmin || hasPerm(rh)) && (
        <NavDropdown icon="users" name="Recursos Humanos" id="rh-menu" data-cy="rhMenu">
          <MenuItem icon="list" to="/rh/rh1-1" data-cy="rh11">
            RH 1.1
          </MenuItem>
          <MenuItem icon="list" to="/rh/rh1-2" data-cy="rh12">
            RH 1.2
          </MenuItem>
          <MenuItem icon="list" to="/rh/rh1-3" data-cy="rh13">
            RH 1.3
          </MenuItem>
        </NavDropdown>
      )}

      {(isSuperAdmin || hasPerm(ventas)) && (
        <NavDropdown icon="chart-line" name="Ventas" id="ventas-menu" data-cy="ventasMenu">
          <MenuItem icon="list" to="/ventas/ventas1-1" data-cy="ventas11">
            Ventas 1.1
          </MenuItem>
          <MenuItem icon="list" to="/ventas/ventas1-2" data-cy="ventas12">
            Ventas 1.2
          </MenuItem>
          <MenuItem icon="list" to="/ventas/ventas1-3" data-cy="ventas13">
            Ventas 1.3
          </MenuItem>
        </NavDropdown>
      )}
    </>
  );
};

export default CentrosMenu;
