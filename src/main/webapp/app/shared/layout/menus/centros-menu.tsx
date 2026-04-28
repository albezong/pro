import React from 'react';
import { NavDropdown } from './menu-components';
import MenuItem from './menu-item';
import { useAppSelector } from 'app/config/store';
import { hasAnyAuthority } from 'app/shared/auth/private-route';
import { AUTHORITIES } from 'app/config/constants';
import { usePermission } from 'app/shared/auth/use-permission';

/**
 * hasAnyPerm: true si el usuario tiene al menos un permiso activo (sin canView).
 */
const hasAnyPerm = (p: ReturnType<typeof usePermission>) => p.canCreate || p.canEdit || p.canDelete || p.canView;

const CentrosMenu = () => {
  const isAuthenticated = useAppSelector(s => s.authentication.isAuthenticated);
  const authorities = useAppSelector(s => s.authentication.account?.authorities ?? []);
  const isAdmin = hasAnyAuthority(authorities, [AUTHORITIES.ADMIN]);
  const loaded = useAppSelector(s => s.permission?.loaded);

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
  if (!isAdmin && !loaded) return null;

  return (
    <>
      {/* ── SEGURIDAD ─────────────────────────────────────────────────────── */}
      {(isAdmin || hasAnyPerm(usuarios) || hasAnyPerm(perfil) || hasAnyPerm(modulos) || hasAnyPerm(permisos)) && (
        <NavDropdown icon="shield-alt" name="Seguridad" id="seguridad-menu" data-cy="seguridadMenu">
          {(isAdmin || hasAnyPerm(usuarios)) && (
            <MenuItem icon="user" to="/seguridad/usuarios-center" data-cy="usuarios">
              Usuarios
            </MenuItem>
          )}
          {(isAdmin || hasAnyPerm(perfil)) && (
            <MenuItem icon="lock" to="/seguridad/profiles-center" data-cy="perfil">
              Perfiles
            </MenuItem>
          )}
          {(isAdmin || hasAnyPerm(modulos)) && (
            <MenuItem icon="th-list" to="/seguridad/modules-center" data-cy="modulos">
              Módulos
            </MenuItem>
          )}
          {(isAdmin || hasAnyPerm(permisos)) && (
            <MenuItem icon="tasks" to="/seguridad/profile-permissions-center" data-cy="permisos">
              Permisos
            </MenuItem>
          )}
        </NavDropdown>
      )}

      {/* ── PRINCIPAL 1 ───────────────────────────────────────────────────── */}
      {(isAdmin || hasAnyPerm(p11) || hasAnyPerm(p12)) && (
        <NavDropdown icon="star" name="Principal 1" id="principal1-menu" data-cy="principal1Menu">
          {(isAdmin || hasAnyPerm(p11)) && (
            <MenuItem icon="list" to="/principal-1-routes/principal-1-1-center" data-cy="principal11">
              Principal 1.1
            </MenuItem>
          )}
          {(isAdmin || hasAnyPerm(p12)) && (
            <MenuItem icon="list" to="/principal-1-routes/principal-1-2-center" data-cy="principal12">
              Principal 1.2
            </MenuItem>
          )}
        </NavDropdown>
      )}

      {/* ── PRINCIPAL 2 ───────────────────────────────────────────────────── */}
      {(isAdmin || hasAnyPerm(p21) || hasAnyPerm(p22)) && (
        <NavDropdown icon="building" name="Principal 2" id="principal2-menu" data-cy="principal2Menu">
          {(isAdmin || hasAnyPerm(p21)) && (
            <MenuItem icon="list" to="/principal-2-routes/principal-2-1-center" data-cy="principal21">
              Principal 2.1
            </MenuItem>
          )}
          {(isAdmin || hasAnyPerm(p22)) && (
            <MenuItem icon="list" to="/principal-2-routes/principal-2-2-center" data-cy="principal22">
              Planificación de Tareas
            </MenuItem>
          )}
        </NavDropdown>
      )}
    </>
  );
};

export default CentrosMenu;
